"use strict";

$(document).ready(function () {
  var socket = io();
  var template = Template7.compile($('#template_item').html());

  var formatItem = function formatItem(item) {
    item.hasStats = item.stats && item.stats.length;
    return item;
  };

  var renderItem = function renderItem(item) {
    $('#items').prepend(template(formatItem(item)));
  };

  socket.on('new_item', function (item) {
    renderItem(JSON.parse(item));
  });
});