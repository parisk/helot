# Helot

Personal bulk email sending should not be a pain in the ass.

## Installation

To install helot just run `npm install helot` or `npm install -g helot`, in case you would like to install it globally.

## Usage

### Command Line Interface

All you have to do to send an email to multiple recipients with Helot's CLI is run the following command in your terminal (if you have installed Helot globally):

```
helot send --template=/path/to/template.md --recipients=/path/to/recipients/csv
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

### output (optional)

Path to a file to which output should be written instead of `stderr`.

### dry-run (optional)

Don't send any email. Just print the output.

## License

Helot is licensed under the MIT License. Detailed license info can be found at the [LICENSE](LICENSE) file.
