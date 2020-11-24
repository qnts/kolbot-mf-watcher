import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import tippy from 'tippy.js';
import moment from 'moment';
import { Channel, Item, ErrorHandler, goLive } from './Api';
import { liquid } from './vendor';
import { runes } from '../../services/GameData';

const isTouch = Boolean('ontouchstart' in window || navigator.msMaxTouchPoints);

/**
 * Calculate list of pages
 * @param {Number} currentPage current page
 * @param {Number} pageCount total page
 * @param {Number} delta number of pages to show before and after currentPage
 * @returns {any[]} array of pages need to display. Numbers stand for page numbers; dot (.) stands for ...
 */
const getPagination = (currentPage, pageCount, delta = 1) => {
  if (pageCount <= 1) {
    return [];
  }
  let range = [];
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    range.unshift('...');
  }
  if (currentPage + delta < pageCount - 1) {
    range.push('...');
  }

  range.unshift(1);
  range.push(pageCount);
  if (currentPage > 1) {
    range.unshift('p');
  }
  if (currentPage < pageCount) {
    range.push('n');
  }

  return range;
};

$(() => {
  // public
  const openCanvas = () => {
    $('body').addClass('menu-open');
  };
  const closeCanvas = () => {
    $('body').removeClass('menu-open');
  };
  const isPage = page => $('body').hasClass(`page-${page || 'home'}`);
  const Template = {
    parsed: {
      itemDetail: liquid.parse($('#template_item_detail').html() || ''),
      item: liquid.parse($('#template_item').html() || ''),
      pagination: liquid.parse($('#template_pagination').html() || ''),
    },
    render: (template, context) => liquid.renderSync(Template.parsed[template], context),
  };
  const Alert = {
    selector: '#alert',
    clear() {
      return $(Alert.selector)
        .removeClass('alert-danger alert-success alert-warning alert-primary alert-secondary alert-info alert-light alert-dark')
        .hide();
    },
    error(text) {
      return Alert.clear().addClass('alert-danger').html(text).show();
    },
    success(text) {
      return Alert.clear().addClass('alert-success').html(text).show();
    },
    warning(text) {
      return Alert.clear().addClass('alert-warning').html(text).show();
    },
  };
  tippy('[data-tippy-content]');
  const validateForm = (name, password) => {
    if (!name || !password) {
      Alert.error('Name and password are required');
      return false;
    }
    if (!name.match('^[a-zA-Z0-9_-]+$')) {
      Alert.error('Channel name can only contain alphanumeric characters, underscore (_) and dash (-)');
      return false;
    }
    return true;
  };
  $('.channel-leave').on('click', async () => {
    if (window.confirm('Are your sure?')) {
      try {
        await Channel.quit();
      } catch (err) {
        console.log(err);
      }
      window.location.reload();
    }
  });
  $('#channel-register').on('click', async e => {
    e.preventDefault();
    const name = $('#channel-name').val().trim();
    const password = $('#channel-password').val().trim();
    if (!validateForm(name, password)) {
      return;
    }
    try {
      await Channel.register(name, password);
      window.location.reload();
    } catch (err) {
      Alert.error(ErrorHandler.getMessage(err));
    }
  });
  // join
  $('#entry-channel-form').on('submit', async e => {
    e.preventDefault();
    const name = $('#channel-name').val().trim();
    const password = $('#channel-password').val().trim();
    if (!validateForm(name, password)) {
      return;
    }
    try {
      await Channel.join(name, password);
      window.location.reload();
    } catch (err) {
      Alert.error(ErrorHandler.getMessage(err));
    }
  });
  $('.channel-go-settings, .open-menu').on('click', openCanvas);
  $('.off-canvas-overlay, .close-menu').on('click', closeCanvas);

  // private
  if ($('body').hasClass('channel-ready')) {
    let page = 1;
    const renderItems = (items, prepend) => {
      items.forEach(item => {
        if (item.name === 'undefined') return;
        item.isRune = runes.includes(item.name);
        const itemTooltip = Template.render('itemDetail', item);
        const html = Template.render('item', item);
        if (prepend) {
          $('#items').prepend(html);
        } else {
          $('#items').append(html);
        }
        tippy(`[data-id='${item._id}']`, {
          content: itemTooltip,
          allowHTML: true,
          interactive: !isTouch,
          maxWidth: 'none',
          appendTo: document.body,
        });
      });
    };
    $('#pagination').on('click', '.page-link', e => {
      e.preventDefault();
      let pageClick = $(e.target).data('page');
      if (pageClick) {
        if (pageClick === 'n') {
          page = page + 1;
        } else if (pageClick === 'p') {
          page = page - 1;
        } else {
          page = pageClick;
        }
        loadItems();
      }
    });
    const getSelectedQualities = () => {
      const qualities = [];
      $('#fillter-quality input').each((i, e) => {
        if ($(e).prop('checked')) qualities.push(e.value);
      });
      return qualities;
    };
    const renderPagination = response => {
      const pages = getPagination(response.page, response.totalPages);
      $('#pagination').html(Template.render('pagination', { page: response.page, total: response.totalPages, pages }));
      $('#dropdown-gotopage-button').on('click', () => {
        const p = $('#dropdown-gotopage').val();
        if (p) {
          page = p;
          loadItems();
        }
      });
    };
    const loadItems = () => {
      $('.loader').show();
      // parse params
      const query = { page };
      const qualities = getSelectedQualities();
      if (qualities.length) {
        query.qualities = qualities.join(',');
      }
      let date = moment($('#filter-date').val());
      if (!date.isValid()) {
        date = moment(); // now
        $('#filter-date').val(date.format('YYYY-MM-DD'));
      }
      // convert to utc
      query.date = date.startOf('d').utc().valueOf();
      Item.all(query).then(pagination => {
        $('#items').html('');
        renderItems(pagination.docs);
        renderPagination(pagination);
        $('.loader').hide();
      }).catch(err => {
        console.log(err);
      });
    };
    $('#filter-prev-date').on('click', () => {
      let date = moment($('#filter-date').val());
      if (!date.isValid()) {
        date = moment(); // now
      }
      $('#filter-date').val(date.subtract(1, 'd').format('YYYY-MM-DD'));
      loadItems();
    });
    $('#filter-next-date').on('click', () => {
      let date = moment($('#filter-date').val());
      if (!date.isValid()) {
        date = moment(); // now
      }
      $('#filter-date').val(date.add(1, 'd').format('YYYY-MM-DD'));
      loadItems();
    });
    // default load
    (async () => {
      // const channelId = await Channel.join('qnts028', 'quyet123');
      if (isPage('home')) {
        // load some items
        Item.all({ limit: 10, date: moment().startOf('d').utc().valueOf() }).then(pagination => {
          if (pagination.docs.length) {
            $('#items').html('');
            renderItems(pagination.docs);
          }
        }).catch(err => {
          console.log(err);
        });
        // load new item
        goLive(items => {
          renderItems(items, true);
        });
      } else if (isPage('inventory')) {
        loadItems();
        $('#apply-filter').on('click', () => {
          if (!getSelectedQualities().length) {
            alert('You must select at least 1 quality');
            return;
          }
          loadItems();
        });
      }
    })();
  }
});
