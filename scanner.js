const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const io = require('socket.io-client');

const socket = io(config.socketio.host, {
  path: config.socketio.path,
});

const itemLogFile = path.join(config.baseKolbotDirectory, 'd2bs/kolbot/logs/itemLog.txt');

const profileLogFile = profileName => path.join(config.baseKolbotDirectory, 'd2bs/kolbot/data', `${profileName}.json`);
const getArea = (profileName) => {
  try {
    const char = JSON.parse(fs.readFileSync(profileLogFile(profileName), 'utf8'));
    return char.lastArea;
  } catch (err) {
    return 'Unknown';
  }
};

const regex =/\[(.+?)\] <(.+?)> <(.+?)> \((.+?)\) (.+?)( \| (.+?)$|$)/;
const parseLine = line => {
  let matches = line.match(regex);
  const item = {
    timestamp: matches[1],
    profile: matches[2],
    action: matches[3],
    quality: matches[4],
    name: matches[5].trim(),
    stats: matches.length >= 7 ? matches[6] : '',
    area: getArea(matches[2]),
    level: 1,
    isRecipe: /\{Cubing \d+\}$|\{Cubing-(.+?)\}$/.test(line),
  };
  // add item level
  const level = item.name.match(/\((\d+)\)$/);
  if (level && level[1]) {
    item.level = parseInt(level[1]);
    // remove item level in name
    item.name = item.name.replace(/ \(\d+\)/, '');
  }
  // fix item name
  if (item.name.indexOf('Cost:') > -1) {
    item.name = item.stats.split(' | ')[1].trim();
  }
  // format stats as array
  const splitted = item.stats.split('| ');
  const stats = [];
  for (let i = 0; i < splitted.length; i++) {
    const stat = splitted[i].trim().replace(/ \{Cubing \d+\}|\{Cubing-(.+?)\}|\{doCubing\}/g, '');
    if (!stat || stat == item.name) continue;
    stats.push(stat);
  }
  item.stats = stats;
  return item;
};

function parseBuffer (buffer) {
  if (socket.connected) {
    buffer.toString().split(require('os').EOL).forEach(line => {
      const l = line.trim();
      if (!l) return;
      const item = parseLine(l);
      console.log(item);
      if (config.ignoreCubingRecipe && item.isRecipe) return;
      if (config.logWhat.includes(item.action)) {
        socket.emit('new_item', JSON.stringify(item));
      }
    });
  }
}

const main = async () => {
  // Obtain the initial size of the log file before we begin watching it.
  let fileSize = fs.statSync(itemLogFile).size;
  fs.watchFile(itemLogFile, (current, previous) => {
    // Check if file modified time is less than last time.
    // If so, nothing changed so don't bother parsing.
    if (current.mtime <= previous.mtime) { return; }

    // We're only going to read the portion of the file that
    // we have not read so far. Obtain new file size.
    const newFileSize = fs.statSync(itemLogFile).size;
    // Calculate size difference.
    let sizeDiff = newFileSize - fileSize;
    // for some reason, we truncate the file -> newSize < oldSize
    if (sizeDiff < 0) {
      fileSize = 0;
      sizeDiff = newFileSize;
    }
    // Create a buffer to hold only the data we intend to read.
    const buffer = Buffer.alloc(sizeDiff);
    // Obtain reference to the file's descriptor.
    const fileDescriptor = fs.openSync(itemLogFile, 'r');
    // Synchronously read from the file starting from where we read
    // to last time and store data in our buffer.
    fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
    fs.closeSync(fileDescriptor); // close the file
    // Set old file size to the new size for next read.
    fileSize = newFileSize;

    // Parse the line(s) in the buffer.
    parseBuffer(buffer);
  });
};

main();
