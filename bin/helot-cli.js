#!/usr/bin/env node

var cli = require('cli');
var env = require('node-env-file');
var helot = require(__dirname + '/../helot');
var fs = require('fs');

/* Command Line Interface */
cli.parse({
  template: ['t', 'Path to front-matter enabled Markdown template file', 'path'],
  recipients: ['r', 'Path to the CSV format recipients file', 'path'],
  out: ['o', 'Path to the file that the logs should be written, instead of stderr', 'path'],
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

  var logStream = process.stderr;

  if (options.out) {
    logStream = fs.createWriteStream(options.out);
  }

  if (!process.env.SMTP_SERVER) {
    logStream.write('You should configure the SMTP_SERVER environment variable.\n');
    shouldExit = true;
  }

  if (!process.env.SMTP_PORT) {
    logStream.write('You should configure the SMTP_PORT environment variable.\n');
    shouldExit = true;
  }

  if (!process.env.SMTP_LOGIN) {
    logStream.write('You should configure the SMTP_LOGIN environment variable.\n');
    shouldExit = true;
  }

  if (!process.env.SMTP_PASSWORD) {
    logStream.write('You should configure the SMTP_PASSWORD environment variable.\n');
    shouldExit = true;
  }

  if (!process.env.HELOT_FROM) {
    process.env.HELOT_FROM = process.env.SMTP_LOGIN;
  }

  if (shouldExit) {
    logStream.write('Exiting.\n');
    process.exit();
  }

  var smtpServer;

  if (!options['dry-run']) {
    smtpServer = helot.getSmtpServer(
      process.env.SMTP_SERVER, process.env.SMTP_PORT,
      process.env.SMTP_LOGIN, process.env.SMTP_PASSWORD
    );
  }

  var recipients = helot.getRecipientsFromFile(options.recipients);

  for (var i in recipients) {
    var recipient = recipients[i];
    logStream.write('Sending template "' + options.template + '" to ' + recipient.email + '\n');
    if (!options['dry-run']) {
      helot.sendTemplateFileToRecipient(
        smtpServer, process.env.HELOT_FROM, options.template, recipient, function(err, message) {
          if (err) {
            logStream.write('Could not send email to ' + recipient.email + ':' + err + '\n');
          } else {
            logStream.write('Message sent successfully to ' + recipient.email + '.\n');
          }
        }
      );
    }
  }
});
