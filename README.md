# Competitive Programming Contest Manager (CPM)

`cpm` is a CLI tool designed to manage and organize solutions for competitive programming contests. `It acts as a centralized repository for storing, accessing, and sharing solutions, helping you efficiently manage your contest work.`

## Features
- **Configuration**: Set up and manage your contest directory.
- **Listing**: View contests with options to filter by completion status.
- **Creation**: Create new contests with optional sub-directories and input/output files for problems.
- **Deletion**: Remove contests from the repository.
- **Marking**: Mark contests as complete or incomplete.
- **Renaming**: Rename contests for better organization.
- **Opening**: Open contest directories directly in VS Code.
- **Exporting**: Share your contest solutions easily by exporting them.
- **Workspace**: Open the entire contest directory workspace in VS Code.

---

## Installation

1. Ensure you have [Node.js](https://nodejs.org/) installed on your system.
2. Clone this repository or download the source code.

	```bash
	git clone https://github.com/nourist/cp-contest-manager-cli.git
	```
3. Navigate to the project directory

	```bash
	cd cp-contest-manager-cli
	``` 
4. Run the following command to install dependencies:

   ```bash
   npm install
   ```
5. Make the CLI tool globally accessible:

   ```bash
   npm i -g .
   ```

Now you can use `cpm` from anywhere in your terminal.

---

## Usage

### General Command Format
```bash
cpm <command> [options]
```

### Available Commands

#### `config`
Configure the contest manager.

```bash
cpm config [path] [options]
```
- **Path**: Specify the directory for storing/exporting contest solutions.
- **Options**:
  - `-c, --content <content>`: Configure specific content. Choices:
    - `contest`: Path to store contests.
    - `export`: Path to export contests.

#### `list`
List all contests.

```bash
cpm list [options]
```
- **Options**:
  - `-a, --ac`: List only completed (AC) contests.

#### `create`
Create a new contest.

```bash
cpm create [options]
```
- **Options**:
  - `-s, --sub`: Create sub-directories for each problem.
  - `-i, --io`: Create input/output files for each problem.

#### `delete`
Delete a contest.

```bash
cpm delete [name]
```
- **Name**: Specify the name of the contest to delete.

#### `mark`
Mark a contest as complete.

```bash
cpm mark [name]
```
- **Name**: Specify the name of the contest to mark.

#### `unmark`
Mark a contest as incomplete.

```bash
cpm unmark [name]
```
- **Name**: Specify the name of the contest to unmark.

#### `rename`
Rename a contest.

```bash
cpm rename [options]
```
- **Options**:
  - `-o, --oldname <oldname>`: The current name of the contest.
  - `-n, --newname <newname>`: The new name for the contest.

#### `open`
Open a contest directory in VS Code.

```bash
cpm open [name]
```
- **Name**: Specify the name of the contest to open.

#### `export`
Export contests for easy sharing.

```bash
cpm export [name] [options]
```
- **Name**: Specify the name of the contest to export.
- **Options**:
  - `-a, --all`: Export all contests.
  - `-c, --ac`: Export only completed contests.

#### `workspace`
Open the folder containing all contests in VS Code.

```bash
cpm workspace
```

---

### Development
If you want to contribute or modify this tool:

1. Install as [installation](#installation) guide above 
2. Run the tool locally

```bash
npm start <command>
```

---

## License
This project is licensed under the Creative Commons Attribution-NonCommercial (CC BY-NC) License. See the [LICENSE](LICENSE) file for details.

---

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or suggestions.

---

## Acknowledgments
This tool uses the following libraries:
- [commander](https://www.npmjs.com/package/commander): For creating CLI commands.
- [inquirer](https://www.npmjs.com/package/inquirer): For interactive prompts.
- [inquirer-search-list](https://www.npmjs.com/package/inquirer-search-list): For searchable list prompts.
- [colors](https://www.npmjs.com/package/colors): For styling console outputs with colors.
- [cli-table](https://www.npmjs.com/package/cli-table): For displaying tabular data in the console.
- [app-root-path](https://www.npmjs.com/package/app-root-path): For get the project root path
- [fs-extra](https://www.npmjs.com/package/fs-extra): For more features than `fs` module

---

This project is created and maintained by [Nourist](https://github.com/nourist). If you enjoy this tool, feel free to give it a star on GitHub or share it with others!

Enjoy managing your contests with **cp-contest-manager**!
