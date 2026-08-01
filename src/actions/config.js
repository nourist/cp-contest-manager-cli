import inquirer from 'inquirer';
import fs from 'fs-extra';

import { getConfig, updateConfig } from '../utils/config.js';

export default async (str, options) => {
	if (!options.content) {
		const config = getConfig();
		const ans = await inquirer.prompt([
			{
				type: 'list',
				name: 'content',
				message: 'What do you want to configure?',
				choices: [
					{ name: `contestDir (${config.contestDir || 'Not set'})`, value: 'contestDir' },
					{ name: `exportDir (${config.exportDir || 'Not set'})`, value: 'exportDir' },
					{ name: `defaultLang (${config.defaultLang || 'Not set'})`, value: 'defaultLang' },
					{ name: `autoCommit (${config.autoCommit})`, value: 'autoCommit' },
					{ name: `autoOpen (${config.autoOpen})`, value: 'autoOpen' },
					{ name: `editor (${config.editor})`, value: 'editor' },
				],
			},
		]);
		options.content = ans.content;
	}

	if (options.content === 'defaultLang') {
		if (!str) {
			const ans = await inquirer.prompt([
				{
					type: 'list',
					name: 'lang',
					message: 'Select the default language extension:',
					choices: ['cpp', 'py', 'java', 'js', 'Other (type manually)'],
				},
			]);
			str = ans.lang;
			if (str === 'Other (type manually)') {
				const ans2 = await inquirer.prompt([
					{
						type: 'input',
						name: 'lang',
						message: 'Enter the default language extension (e.g. rs, go, c):',
					},
				]);
				str = ans2.lang;
			}
		}
		const config = getConfig();
		config.defaultLang = str.replace(/^\./, ''); // remove dot if any
		updateConfig(config);
		console.log('Update defaultLang successfully'.success);
		return;
	}

	if (options.content === 'autoCommit') {
		const ans = await inquirer.prompt([
			{
				type: 'list',
				name: 'autoCommit',
				message: 'Enable auto-commit when marking a problem/contest as AC?',
				choices: [
					{ name: 'Yes', value: true },
					{ name: 'No', value: false },
				],
				default: getConfig().autoCommit ? 0 : 1,
			},
		]);
		const config = getConfig();
		config.autoCommit = ans.autoCommit;
		updateConfig(config);
		console.log('Update autoCommit successfully'.success);
		return;
	}

	if (options.content === 'autoOpen') {
		const ans = await inquirer.prompt([
			{
				type: 'list',
				name: 'autoOpen',
				message: 'Automatically open the contest directory when creating a new contest?',
				choices: [
					{ name: 'Yes', value: true },
					{ name: 'No', value: false },
				],
				default: getConfig().autoOpen ? 0 : 1,
			},
		]);
		const config = getConfig();
		config.autoOpen = ans.autoOpen;
		updateConfig(config);
		console.log('Update autoOpen successfully'.success);
		return;
	}

	if (options.content === 'editor') {
		const ans = await inquirer.prompt([
			{
				type: 'list',
				name: 'editor',
				message: 'Select the editor to use:',
				choices: [
					{ name: 'VS Code', value: 'vscode' },
					{ name: 'Zed', value: 'zed' },
				],
				default: getConfig().editor === 'zed' ? 1 : 0,
			},
		]);
		const config = getConfig();
		config.editor = ans.editor;
		updateConfig(config);
		console.log('Update editor successfully'.success);
		return;
	}

	if (str && !fs.pathExistsSync(str)) {
		console.log(`Path doesn't exist for ${options.content}.`.error);
		return;
	}
	if (!str) {
		const ans = await inquirer.prompt([
			{
				type: 'input',
				name: 'path',
				message: `Enter the path of the ${options.content}:`,
				validate: (path) => {
					if (fs.pathExistsSync(path)) {
						return true;
					}
					return "Path doesn't exist.";
				},
			},
		]);
		str = ans.path;
	}

	const config = getConfig();
	config[options.content] = str;
	updateConfig(config);

	console.log(`Update ${options.content} successfully`.success);
};
