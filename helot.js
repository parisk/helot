module.exports = {};

var csv = require('csv-parser');
var fm = require('front-matter');
var fs = require('fs');
var md = require('markdown-it')('commonmark');
var mustache = require('mustache');
var emailjs = require('emailjs');

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
    body: parsedTemplate.body.trim(),
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

function sendTemplateToRecipient(smtpServer, sender, template, recipient, callback) {
  var renderedTemplate = renderTemplate(template.body, recipient),
      recipientTo = recipient.email;

  if (recipient.name) {
    recipientTo = recipient.name + ' <' + recipient.email + '>';
  }

  var message	= {
    text:	renderTemplate.text,
    from:	sender,
    to: recipientTo,
    subject: template.data.subject,
    attachment:[{data: renderedTemplate.html, alternative:true}]
  };

  smtpServer.send(message, callback);
}

function sendTemplateFileToRecipient(server, sender, path, recipient) {
  var template = getTemplateFromFile(path);
  return sendTemplateToRecipient(server, sender, template, recipient);
}

function getSmtpServer(server, port, login, password) {
  var smtpServer = emailjs.server.connect({
    user:	process.env.SMTP_LOGIN,
    password: process.env.SMTP_PASSWORD,
    host:	server,
    port: port,
    ssl: true
  });

  return smtpServer;
}

module.exports.getRecipientsFromFile = getRecipientsFromFile;
module.exports.getRecipients = getRecipients;
module.exports.getTemplate = getTemplate;
module.exports.getTemplateFromFile = getTemplateFromFile;
module.exports.renderTemplate = renderTemplate;
module.exports.sendTemplateToRecipient = sendTemplateToRecipient;
module.exports.sendTemplateFileToRecipient = sendTemplateFileToRecipient;
module.exports.getSmtpServer = getSmtpServer;
