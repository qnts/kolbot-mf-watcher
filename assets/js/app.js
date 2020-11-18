import $ from 'jquery';
import Template7 from 'template7';
import { Channel, Item } from './Api';

$(() => {
  var socket = io();
  var template = Template7.compile($('#template_item').html());
  var formatItem = item => {
    item.hasStats = item.stats && item.stats.length;
    return item;
  };
  var renderItem = item => {
    $('#items').prepend(template(formatItem(item)));
  };
  socket.on('new_item', item => {
    renderItem(JSON.parse(item));
  });
  (async () => {
    const channelId = await Channel.join('qnts028', 'quyet123');
    const items = await Item.all();
    console.log(channelId, items);
  })();
});
