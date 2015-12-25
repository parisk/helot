#!/usr/bin/env node

module.exports = {};

var cli = require('cli');
var csv = require('csv-parser');
var fm = require('front-matter');
var fs = require('fs');
var md = require('markdown-it')('commonmark');
var mustache = require('mustache');
var env = require('node-env-file');

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

/* Command Line Interface */
cli.parse({
    template:   ['t', 'Path to front-matter enabled Markdown template file', 'path'],
    recipients:  ['r', 'Path to the CSV format recipients file', 'path'],
    output: ['o', 'Path to the file that the logs should be written, instead of stderr', 'path'],
    'dry-run': [false, 'Do nothing. Just print logs.', 'boolean', false],
    'env-file': [false, 'Path to a file that contains environment variables to be loaded', 'path', '.env']
});

cli.main(function (args, options) {
  /* Load .env file */
  if (fs.statSync(options['env-file']).isFile()) {
    env(options['env-file']);
  }

  var shouldExit = false;

  /* Check validity of CLI options */
  if (!options.template) {
    process.stderr.write('You have to provide a template file.\n');
    shouldExit = true;
  }

  if (!options.recipients) {
    process.stderr.write('You have to provide a recipients file.\n');
    shouldExit = true;
  }

  var smtpServer = process.env.SMTP_SERVER;
  var smtpPort = process.env.SMTP_PORT;
  var smtpLogin = process.env.SMTP_LOGIN;
  var smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpServer) {
    process.stderr.write('You should configure the SMTP_SERVER environment variable.\n');
    shouldExit = true;
  }

  if (!smtpPort) {
    process.stderr.write('You should configure the SMTP_PORT environment variable.\n');
    shouldExit = true;
  }

  if (!smtpLogin) {
    process.stderr.write('You should configure the SMTP_LOGIN environment variable.\n');
    shouldExit = true;
  }

  if (!smtpPassword) {
    process.stderr.write('You should configure the SMTP_PASSWORD environment variable.\n');
    shouldExit = true;
  }

  if (shouldExit) {
    process.stderr.write('Exiting.\n');
    process.exit();
  }

  var template = getTemplateFromFile(options.template);
  var recipients = getRecipientsFromFile(options.recipients);

  for (var i in recipients) {
    var recipient = recipients[i];
    var renderedTemplate = renderTemplate(template.template, recipient);
    console.log('Sending template "' + options.template + '" to ' + recipient.email);
  }
});

