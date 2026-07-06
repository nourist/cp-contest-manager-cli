#!/usr/bin/env node

import { Command, Option } from 'commander';

import './config/colors.js';
import './config/inquirer.js';
import { version } from './constants/index.js';
import { getConfig } from './utils/config.js';

import config from './actions/config.js';
import list from './actions/list.js';
import create from './actions/create.js';
import deleteC from './actions/delete.js';
import mark from './actions/mark.js';
import unmark from './actions/unmark.js';
import rename from './actions/rename.js';
import open from './actions/open.js';
import exportC from './actions/export.js';
import workspace from './actions/workspace.js';
import link from './actions/link.js';
import push from './actions/push.js';
import pull from './actions/pull.js';
import search from './actions/search.js';

import templateEdit from './actions/template/edit.js';
import templateCreate from './actions/template/create.js';
import templateDelete from './actions/template/delete.js';

import problemAdd from './actions/problem/add.js';
import problemDelete from './actions/problem/delete.js';
import problemMark from './actions/problem/mark.js';
import problemRename from './actions/problem/rename.js';
import problemOpen from './actions/problem/open.js';
import problemMove from './actions/problem/move.js';

const program = new Command();

program
	.name('cpm')
	.description(
		'Cli tool to manage competitive programming contest ' +
			'solution'.bgBlue,
	)
	.version(version);

program.hook('preAction', (thisCommand, actionCommand) => {
	const { contestDir } = getConfig();

	if (
		!contestDir &&
		actionCommand.name() !== 'config' &&
		actionCommand.name() !== 'help' &&
		actionCommand.name() !== thisCommand.name()
	) {
		console.log(
			"You haven't configured the contest directory yet. \nPlease run `cpm config` to configure the contest directory."
				.error,
		);
		process.exit(1);
	}
});

program
	.command('config')
	.description('Configure contest manager')
	.argument('[path]', 'Path to directory')
	.addOption(
		new Option(
			'-c, --content <content>',
			'Content to configure',
		).choices(['contest', 'export', 'defaultLang', 'autoCommit']),
	)
	.action(config);

program
	.command('list')
	.description('List contests')
	.option('-a, --ac', 'List only AC contests')
	.action(list);

program
	.command('create')
	.description('Create new contest')
	.option('-s, --sub', 'Create sub-directory for each problem')
	.option('-i, --io', 'Create input/output files for each problem')
	.action(create);

program
	.command('delete')
	.description('Delete contest')
	.argument('[name]', 'Name of contest to delete')
	.action(deleteC);

program
	.command('mark')
	.description('Mark contest as ' + 'Complete'.bgGreen)
	.argument('[name]', 'Name of contest to mark')
	.action(mark);

program
	.command('unmark')
	.description('Mark contest as ' + 'InComplete'.bgRed)
	.argument('[name]', 'Name of contest to unmark')
	.action(unmark);

program
	.command('rename')
	.description('Rename contest')
	.option('-o, --oldname <oldname>', 'Name of contest to rename')
	.option('-n, --newname <newname>', 'Name to replace')
	.action(rename);

program
	.command('open')
	.description('Open contest directory in ' + 'VScode'.bgCyan)
	.argument('[name]')
	.action(open);

program
	.command('export')
	.description('Export contests for easy sharing')
	.option('-a, --all', 'Export all contests')
	.option('-c, --ac', 'Export only complete contest')
	.argument('[name]', 'Name of contest to export')
	.action(exportC);

program
	.command('workspace')
	.description('Open folder contains all contests in ' + 'VScode'.bgCyan)
	.action(workspace);

program
	.command('link')
	.description(
		'Link contest directory to a ' + 'Git'.bgMagenta + ' repository',
	)
	.argument('[url]', 'Git repository URL')
	.action(link);

program
	.command('push')
	.description('Auto commit and push to ' + 'Git'.bgMagenta)
	.argument('[message]', 'Commit message')
	.action(push);

program
	.command('pull')
	.description('Pull from ' + 'Git'.bgMagenta)
	.action(pull);

program
	.command('search')
	.description('Global real-time search for problems')
	.action(search);

const templateCmd = program
	.command('template')
	.description('Manage templates');

templateCmd
	.command('edit [ext]')
	.description('Edit a template')
	.action(templateEdit);

templateCmd
	.command('create [ext]')
	.description('Create a new template')
	.action(templateCreate);

templateCmd
	.command('delete [ext]')
	.description('Delete a template')
	.action(templateDelete);

const problemCmd = program
	.command('problem')
	.description('Manage problems in a contest');

problemCmd
	.command('add [contest]')
	.description('Add new problems to a contest')
	.option('-s, --sub', 'Use sub directory for each problem')
	.option('-i, --io', 'Create I/O files for each problem')
	.action(problemAdd);

problemCmd
	.command('delete [contest]')
	.description('Delete problems from a contest')
	.action(problemDelete);

problemCmd
	.command('mark [contest]')
	.description('Mark problems as AC')
	.action(problemMark);

problemCmd
	.command('rename [contest]')
	.description('Rename a problem')
	.action(problemRename);

problemCmd
	.command('open [contest]')
	.description('Open a problem in VS Code')
	.action(problemOpen);

problemCmd
	.command('move [contest]')
	.description('Move a problem to another contest')
	.action(problemMove);

program.parse(process.argv);
