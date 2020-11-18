import $ from 'jquery';
import { Channel, Item, Server } from './Api';
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
  socket.on('new_item', item => {
    renderItem(JSON.parse(item));
  });
  (async () => {
    const channelId = await Channel.join('qnts028', 'quyet123');
    const items = await Item.all('2020-11-15');
    items.forEach(i => renderItem(i));
  })();
});
