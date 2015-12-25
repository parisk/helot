# Helot

Personal bulk email sending should not be a pain in the ass.

## Installation

To install helot just run `npm install helot` or `npm install -g helot`, in case you would like to install it globally.

## Usage

### Configuration

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

### Command Line Interface

All you have to do to send an email to multiple recipients with Helot's CLI is run the following command in your terminal, assumint that you have installed Helot globally and have a configured environment:

```
helot --template=/path/to/template.md --recipients=/path/to/recipients/csv
```

### Options

The following options are available to the Command Line Interface of Helot

### template

The path to the front-matter enabled Markdown template that Helot should parse and render with each recipient's data.

#### Template example

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

### recipients

The path to the recipients file that will be used to send the emails and render each template.

#### Example recipients file
```csv
name,email,address
John Doe,john@example.com,1 Sesame str.
Bob,bob@example.com,1024 Public Rd.
Alice,alice@example.com,2048 Private Rd.
```

### out (optional)

Path to a file to which output should be written instead of `stderr`.

### dry-run (optional)

Don't send any email. Just print the output.

### env-file (optional)

Path to a file that contains environment variables to load. **Default value**: `.env`

#### Example env file
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
SMTP_LOGIN=youremail@gmail.com
SMTP_PASSWORD=your email password
HELOT_FROM=Your name <youremail@gmail.com>
```


## License

Helot is licensed under the MIT License. Detailed license info can be found at the [LICENSE](LICENSE) file.
