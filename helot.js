module.exports = {};

var csv = require('csv-parser');
var fm = require('front-matter');
var fs = require('fs');
var md = require('markdown-it')('commonmark');
var mustache = require('mustache');

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

function getTemplate(text) {
  var parsedTemplate = fm(text);
  var template = {
    template: parsedTemplate.body,
    data: parsedTemplate.attributes
  };

  return template;
}

function getTemplateFromFile(path) {
  var templateText = fs.readFileSync(path);

  return getTemplate(templateText.toString('utf-8'));
}

function renderTemplate(template, data) {
  template = mustache.render(template, data);

  var renderedTemplate = {
    text: template,
    html: md.render(template)
  };

  return renderedTemplate;
}

module.exports.getRecipientsFromFile = getRecipientsFromFile;
module.exports.getRecipients = getRecipients;
module.exports.getTemplate = getTemplate;
module.exports.getTemplateFromFile = getTemplateFromFile;
module.exports.renderTemplate = renderTemplate;
