$(document).ready(function () {
  var socket = io();
  var template = Template7.compile($('#template_item').html());
  var formatItem = function (item) {
    item.hasStats = item.stats && item.stats.length;
    return item;
  };
  var renderItem = function (item) {
    $('#items').prepend(template(formatItem(item)));
  };
  [
    {"timestamp":"2020/11/15 23:44:53","profile":"Leader-light","action":"Kept","quality":"normal","name":"Ral Rune","stats":["Can be Inserted into Socketed Items","Weapons: Adds 5-30 fire damage","Armor: Fire Resist +30%","Helms: Fire Resist +30%","Shields: Fire Resist +35%","Required Level: 19"],"area":"Chaos Sanctuary","level":1,"isRecipe":true},
    {"timestamp":"2020/11/15 23:13:57","profile":"Follower-Ham","action":"Sold","quality":"unique","name":"Nagelring","stats":["Ring","Required Level: 7","+64 to Attack Rating","Magic Damage Reduced by 3","Attacker Takes Damage of 3","21% Better Chance of Getting Magic Items"],"area":"The Worldstone Chamber","level":82,"isRecipe":false},
    {"timestamp":"2020/11/15 23:13:57","profile":"Follower-Ham","action":"Sold","quality":"crafted","name":"Nagelring","stats":["Ring","Required Level: 7","+64 to Attack Rating","Magic Damage Reduced by 3","Attacker Takes Damage of 3","21% Better Chance of Getting Magic Items"],"area":"The Worldstone Chamber","level":82,"isRecipe":false},
    {"timestamp":"2020/11/15 23:13:57","profile":"Follower-Ham","action":"Sold","quality":"set","name":"Nagelring","stats":["Ring","Required Level: 7","+64 to Attack Rating","Magic Damage Reduced by 3","Attacker Takes Damage of 3","21% Better Chance of Getting Magic Items"],"area":"The Worldstone Chamber","level":82,"isRecipe":false},
    {"timestamp":"2020/11/15 23:13:57","profile":"Follower-Ham","action":"Sold","quality":"rare","name":"Nagelring","stats":["Ring","Required Level: 7","+64 to Attack Rating","Magic Damage Reduced by 3","Attacker Takes Damage of 3","21% Better Chance of Getting Magic Items"],"area":"The Worldstone Chamber","level":82,"isRecipe":false},
  ].forEach(item => renderItem(item));
  socket.on('new_item', function (item) {
    renderItem(JSON.parse(item));
  });

});
