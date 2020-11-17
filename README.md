# mf-watcher

Watch your kolbot item log and send output to your web server.

## Usage

The project contains 2 part:
- The first is a `scanner` which will run locally on the same computer you're running kolbot with
- The last is a web server to receive the result from scanner and display it in a browser

### Nodejs

In order to use scanner, you must install nodejs: https://nodejs.org
After installing nodejs, run `npm install` to install dependencies.

### Configuration

Open `config.json`:

```json
{
  "socketio": {
    "host": "http://localhost:3000",
    "path": "/socket.io"
  },
  "baseKolbotDirectory": "../kolbot/",
  "logWhat": [
    "Kept", "Sold", "Field Kept", "Runeword Kept", "Cubing Kept",
    "Shopped", "Gambled"
  ],
  "ignoreCubingRecipe": true
}
```
`socketio`: socket io server. If you run the web server locally, leave default.

`baseKolbotDirectory`: your kolbot's root directory. E.g: `C:/kolbot/` (remember to always include `/` at the end)

`logWhat`: Only log what kind of action the bot did to the item it found

`ignoreCubingRecipe`: if true, cubing recipe ingredents (gems, runes, base items) will be ignored

### Web server

To test the web server locally, run: `node index.js`.
Open browser and go to http://localhost:3000

### scanner

Run the following command (in a command line or powershell):

`node scanner.js`

This will watch for the itemLog.txt in your kolbot folder, any items found will be parsed and send to the web server.
