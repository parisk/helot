module.exports = {};

var csv = require('csv-parser');
var fs = require('fs');

function getRecipients(text) {
  var csvParserStream = csv();
  var recipients = [];
  var row = null;

  csvParserStream.write(text);
  csvParserStream.end();

  do {
    row = csvParserStream.read();
    if (row) {
      recipients.push(row);
    }
  } while(row);

  return recipients;
}

function getRecipientsFromFile(path) {
  var text = fs.readFileSync(path);
  return getRecipients(text);
}

module.exports.getRecipientsFromFile = getRecipientsFromFile;
module.exports.getRecipients = getRecipients;
