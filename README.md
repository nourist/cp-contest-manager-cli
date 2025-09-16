Competitive Programming Contest Manager (CPM)

cpm is a CLI tool designed to manage and organize solutions for competitive programming contests.
It acts as a centralized repository for storing, accessing, and sharing solutions, helping you efficiently manage your contest work.

Unlike traditional OJ tools, CPM does not run or check code. Instead, it focuses on organizing, marking, and exporting your solutions with clean structure and metadata.

✨ Features
📂 Contest & Problem Management

Initialize Contest: Create a new contest folder with default structure.

Add Problem: Create problem folders and solution files from language templates.

Flexible Structure:

Nested mode: each problem has its own subfolder in code/ and filenames follow problem id.

Flat mode: all problem files stay directly inside code/.

Resource Management: Keep statements, editorial, and sample files inside resources/.

Local Testing Folder: Each contest has a test/ folder (ignored in git) for user-side testing.

✅ Metadata & Status

Marking: Mark problems as AC, WIP, or other statuses.

Listing: View contests and their status.

Renaming: Rename contests for better organization.

Workspace: Open the whole contest or all contests in editor (e.g. VS Code).

📦 Exporting

Export contest for easy sharing:

Code only

Resources only

Entire contest

🎨 Templates

Language-specific templates stored globally in templates/.

Editable with command:

cpm template edit <lang>

🔧 Configuration

Global config stored at workspace root (config.json):

{
  "defaultLanguage": "cpp",
  "editor": "code",
  "gitIntegration": true,
  "defaultMode": "nested"
}


Contest config stored inside .oj/config.json:

{
  "name": "Contest ABC",
  "date": "2025-09-16",
  "mode": "nested",
  "problems": [
    { "id": "a", "title": "Problem A", "status": "AC" },
    { "id": "b", "title": "Problem B", "status": "WIP" }
  ]
}

🔄 Git Integration

Initialize and manage git repo across contests.

Useful for version control of all solutions:

cpm git init
cpm git commit -m "Solved A"

📂 Folder Structure
Workspace Root
workspace-root/
├── contests/
│   ├── contest-1/
│   └── contest-2/
├── templates/
│   ├── cpp/
│   │   └── main.cpp
│   ├── python/
│   │   └── main.py
│   └── ...
└── config.json

Contest (Nested Mode)
contest-abc/
├── .oj/
│   └── config.json
├── code/
│   ├── problem-a/
│   │   ├── a.cpp
│   │   └── a.py
│   └── problem-b/
│       └── b.cpp
├── resources/
│   ├── statement.md
│   ├── editorial.pdf
│   └── samples/
│       ├── 1.in
│       └── 1.out
├── test/                # ignored by git
└── README.md

Contest (Flat Mode)
contest-abc/
├── .oj/
│   └── config.json
├── code/
│   ├── a.cpp
│   ├── b.cpp
│   └── ...
├── resources/
├── test/
└── README.md

⚙️ Installation

Ensure you have Node.js
 installed.

Clone the repository:

git clone https://github.com/yourname/cpm.git
cd cpm


Install dependencies:

npm install


Make the CLI tool globally accessible:

npm i -g .


Now you can use cpm from anywhere in your terminal.

🚀 Usage
General Command Format
cpm <command> [options]

Commands
config

Configure the contest manager.

cpm config

list

List all contests.

cpm list

init

Create a new contest.

cpm init "Contest ABC"

problem add

Add a problem to a contest.

cpm problem add A

mark

Mark a problem as complete (AC).

cpm mark A AC

rename

Rename a contest.

cpm rename -o old-name -n new-name

open

Open a contest directory in VS Code.

cpm open contest-abc

export

Export contest.

cpm export contest-abc --only code
cpm export contest-abc --all

template

Edit language template.

cpm template edit cpp

git

Initialize or commit with git.

cpm git init
cpm git commit -m "Solved problem A"

📜 License

This project is licensed under the Creative Commons Attribution-NonCommercial (CC BY-NC) License.

🤝 Contributing

Contributions are welcome! Please feel free to submit PRs or open issues for bugs or suggestions.