import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import { Channel, Item } from './Api';
import { liquid } from './vendor';

$(() => {
  const socket = io();
  const template = liquid.parse($('#template_item').html());
  const formatItem = item => {
    item.hasStats = item.stats && item.stats.length;
    return item;
  };
  const renderItem = item => {
    $('#items').prepend(liquid.renderSync(template, formatItem(item)));
  };
  // socket.on('new_item', item => {
  //   renderItem(JSON.parse(item));
  // });
  // (async () => {
  //   const channelId = await Channel.join('qnts028', 'quyet123');
  //   const items = await Item.all('2020-11-15');
  //   items.forEach(i => renderItem(i));
  // })();
  // join
  const validateForm = (name, password) => {
    const alert = $('#alert');
    if (!name || !password) {
      alert.show().text('Name and password are required');
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
      alert.show().text(err.message);
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
      alert.show().text(err.message);
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
