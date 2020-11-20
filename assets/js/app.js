import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import tippy from 'tippy.js';
import { Channel, Item, ErrorHandler } from './Api';
import { liquid } from './vendor';

$(() => {
  // const socket = io();
  const Template = {
    parsed: {
      itemDetail: liquid.parse($('#template_item_detail').html()),
      item: liquid.parse($('#template_item').html()),
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
  // socket.on('new_item', item => {
  //   renderItem(JSON.parse(item));
  // });
  (async () => {
    // const channelId = await Channel.join('qnts028', 'quyet123');
    const items = await Item.all();
    items.forEach(item => {
      const itemTooltip = Template.render('itemDetail', item);
      const html = Template.render('item', item);
      $('#items').append(html);
      tippy(`[data-id='${item._id}']`, {
        content: itemTooltip,
        allowHTML: true,
        interactive: true,
        maxWidth: 'none',
        appendTo: document.body,
      });
    });
  })();
  // join
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
  $('#channel-leave').on('click', async () => {
    if (window.confirm('Are your sure?')) {
      try {
        await Channel.quit();
      } catch (err) {
        console.log(err);
      }
      window.location.reload();
    }
  });
});
