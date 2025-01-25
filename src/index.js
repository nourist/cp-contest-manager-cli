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
		).choices(['contest', 'export']),
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
	.description('Mark contest as ' + 'UnComplete'.bgRed)
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

program.parse(process.argv);
