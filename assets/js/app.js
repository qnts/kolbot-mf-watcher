$(document).ready(() => {
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
});
