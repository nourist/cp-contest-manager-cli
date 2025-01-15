# cp-contest-manager

**cp-contest-manager** is a CLI tool designed to help you efficiently create and manage solutions for competitive programming contests. This tool provides an easy way to organize contests, mark progress, and export data for sharing.

## Features

- **List**: View all contests currently managed by the tool.
- **Create**: Add a new contest to your collection.
- **Delete**: Remove a contest from your collection.
- **Open**: Open a contest directory in Visual Studio Code.
- **Mark**: Mark a contest as completed.
- **Unmark**: Undo the completion mark for a contest.
- **Rename**: Rename contest
- **Export**: Export contest data to another folder for easy sharing.

## Installation

To install **cp-contest-manager**, you need [Node.js](https://nodejs.org/) installed on your system.

```bash
git clone https://github.com/nourist/cp-contest-manager-cli.git
cd cp-contest-manager-cli
npm install -g .
```

## Usage

Run the tool using the following command:

```bash
cpm <command>
```

### Available Commands

#### `list`
Lists all contests currently managed by the tool.

```bash
cpm list
```

#### `create`
Creates a new contest.

```bash
cpm create
```

#### `delete`
Deletes an existing contest.

```bash
cpm delete
```

#### `open`
Opens a contest folder in Visual Studio Code.

```bash
cpm open
```

#### `mark`
Marks a contest as completed.

```bash
cpm mark
```

#### `unmark`
Unmarks a contest as completed.

```bash
cpm unmark
```

#### `rename`
Rename contest

```bash
cpm rename
```

#### `export`
Exports a contest folder to a specified location.

```bash
cpm export
```

## File Structure

**Root directory default**: D:/cpm

Upon initialization, the tool creates the following files in its root directory:

- **data.json**: Stores information about contests.
- **config.json**: Stores configuration settings.

## Development

If you want to contribute or modify this tool, clone the repository and install dependencies:

```bash
git clone https://github.com/nourist/cp-contest-manager-cli.git
cd cp-contest-manager-cli
npm install
```

Run the tool locally:

```bash
node index.js <command>
```

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to submit a pull request or open an issue.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial (CC BY-NC) License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

This tool uses the following libraries:

- [commander](https://www.npmjs.com/package/commander): For creating CLI commands.
- [inquirer](https://www.npmjs.com/package/inquirer): For interactive prompts.
- [inquirer-search-list](https://www.npmjs.com/package/inquirer-search-list): For searchable list prompts.
- [chalk](https://www.npmjs.com/package/chalk): For styling console outputs with colors.
- [cli-table](https://www.npmjs.com/package/cli-table): For displaying tabular data in the console.

---

This project is created and maintained by [Nourist](https://github.com/nourist). If you enjoy this tool, feel free to give it a star on GitHub or share it with others!

Enjoy managing your contests with **cp-contest-manager**!

[hodinhvys@gmail.com]
