# Competitive Programming Contest Manager (CPM)

`cpm` is a CLI tool designed to manage and organize solutions for competitive programming contests. It acts as a centralized repository for storing, accessing, and sharing solutions, helping you efficiently manage your contest work.

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
- **Git Integration**: Seamlessly link, push, and pull from a Git repository.
- **Statistics**: View full statistics of all your contests.
- **Template Management**: Create, edit, and delete templates for different file extensions.
- **Problem Management**: Add, delete, mark, rename, open, and move individual problems.
- **Search**: Global real-time full-text search across all your problem solutions.

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
  - `-c, --content <content>`: Configure specific content. Choices: `contest`, `export`, `defaultLang`, `autoCommit`.

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

#### `mark` / `unmark`
Mark a contest as complete or incomplete.
```bash
cpm mark [name]
cpm unmark [name]
```

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

#### `export`
Export contests for easy sharing.
```bash
cpm export [name] [options]
```
- **Options**:
  - `-a, --all`: Export all contests.
  - `-c, --ac`: Export only completed contests.

#### `workspace`
Open the folder containing all contests in VS Code.
```bash
cpm workspace
```

#### `search`
Global real-time full-text search for problems across all contests.
```bash
cpm search [query]
```
- **Query**: Space-separated terms to search for in problem code or problem names.
- **Features**: 
  - Searches through the file content of all problems in the workspace.
  - Prioritizes problems containing the most distinct matching terms.
  - Provides rich, color-highlighted multi-line code previews directly in the terminal, showing exactly where words were found.
  - Press Enter to instantly open the selected problem in VS Code.

#### Git Integration Commands
Manage your contest workspace via Git easily.
- `cpm link [url]`: Link contest directory to a Git repository.
- `cpm repo`: Show currently linked Git repository.
- `cpm push [message]`: Auto commit and push to Git.
- `cpm pull`: Pull latest changes from Git.

#### `stat`
Show full statistics of all your contests.
```bash
cpm stat
```

#### `template`
Manage coding templates.
- `cpm template edit [ext]`: Edit an existing template.
- `cpm template create [ext]`: Create a new template.
- `cpm template delete [ext]`: Delete a template.

#### `problem`
Manage individual problems within a contest.
- `cpm problem add [contest] [options]`: Add new problems to a contest (options: `-s` for sub-directories, `-i` for I/O files).
- `cpm problem delete [contest]`: Delete problems from a contest.
- `cpm problem mark [contest]`: Mark problems as AC.
- `cpm problem rename [contest]`: Rename a problem.
- `cpm problem open [contest]`: Open a problem in VS Code.
- `cpm problem move [contest]`: Move a problem to another contest.

---

### Development
If you want to contribute or modify this tool:

1. Install as [installation](#installation) guide above 
2. Run the tool locally

```bash
npm run start -- <command>
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
- [@inquirer/prompts](https://www.npmjs.com/package/@inquirer/prompts): For advanced searchable list prompts and interactive UI.
- [colors](https://www.npmjs.com/package/colors): For styling console outputs with colors.
- [cli-table3](https://www.npmjs.com/package/cli-table3): For displaying tabular data in the console.
- [app-root-path](https://www.npmjs.com/package/app-root-path): For get the project root path.
- [fs-extra](https://www.npmjs.com/package/fs-extra): For more features than the standard `fs` module.

---

This project is created and maintained by [Nourist](https://github.com/nourist). If you enjoy this tool, feel free to give it a star on GitHub or share it with others!

Enjoy managing your contests with **cp-contest-manager**!
