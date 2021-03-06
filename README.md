# Helot

Sending personal emails to LOTS of people should not be a pain in the ass. Helot lets you send an email to a CSV list of recipients, based on a Markdown template.

This project was developed entirely in my browser using [SourceLair](https://www.sourcelair.com).

## Installation

To install Helot just run `npm install -g helot`.

## Usage

### Command Line Interface

To send an email to a CSV list of recipients with Helot, run the following command in your terminal:

```
helot --template=/path/to/template.md --recipients=/path/to/recipients.csv
```

#### Command Line Options

The Command Line Interface of Helot can be configured using the following options:

##### template

The path to the front-matter enabled Markdown template that Helot should parse and render with each recipient's data.

###### Template example

```markdown
---
subject: Party next week
---

Hello {{ name }},

Next week we are throwing a party at **Awesome Place**. What about leaving {{ address }} and coming over?

It would be awesome to meet there and have fun.

Looking forward to seeing you.

Cheers,
Paris
```

##### recipients

The path to the recipients file that will be used to send the emails and render each template.

###### Example recipients file
```csv
name,email,address
John Doe,john@example.com,1 Sesame str.
Bob,bob@example.com,1024 Public Rd.
Alice,alice@example.com,2048 Private Rd.
```

##### out (optional)

Path to a file to which output should be written instead of `stderr`.

##### dry-run (optional)

Don't send any email. Just print the output.

##### env-file (optional)

Path to a file that contains environment variables to load. **Default value**: `.env`

###### Example env file
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
SMTP_LOGIN=youremail@gmail.com
SMTP_PASSWORD=your email password
HELOT_FROM=Your name <youremail@gmail.com>
```

### Environment Configuration

Helot should be configured to send emails through an SMTP server. Configuration should happen using the environment variables documented below.

#### SMTP_SERVER

This is the address of the SMTP server that will send the emails. **Example value**: `smtp.gmail.com`.

#### SMTP_PORT

This is the port used to access the SMTP server that will send the emails. **Example value**: `465`.

#### SMTP_LOGIN

This is the login (username) used to authenticate with the SMTP server that will send the emails. **Example value**: `youremail@gmail.com`.

#### SMTP_PASSWORD

This is the password used to authenticate with the SMTP server that will send the emails, along with the given SMTP login/username. **Example value**: `your email password`.

#### HELOT_FROM

This is the address from which the emails will be sent. **Example value**: `Paris Kasidiaris <paris@sourcelair.com>`.

**Default value**: If this environment variable is not configured it will fall back to the value of `SMTP_LOGIN`.

## License

Helot is licensed under the MIT License. Detailed license info can be found at the [LICENSE](LICENSE) file.
