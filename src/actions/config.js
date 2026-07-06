import inquirer from 'inquirer';
import fs from 'fs-extra';

import { getConfig, updateConfig } from '../utils/config.js';

export default async (str, options) => {
	if (!options.content) {
		const ans = await inquirer.prompt([
			{
				type: 'list',
				name: 'content',
				message: 'What do you want to configure?',
				choices: ['contest', 'export', 'defaultLang', 'autoCommit'],
			},
		]);
		options.content = ans.content;
	}
	
	if (options.content === 'defaultLang') {
		if (!str) {
			const ans = await inquirer.prompt([
				{
					type: 'input',
					name: 'lang',
					message: 'Enter the default language extension (e.g. cpp, py, java):',
				}
			]);
			str = ans.lang;
		}
		const config = getConfig();
		config.defaultLang = str.replace(/^\./, ''); // remove dot if any
		updateConfig(config);
		console.log('Update config successfully'.success);
		return;
	}

	if (options.content === 'autoCommit') {
		const ans = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'autoCommit',
				message: 'Do you want to enable auto-commit when marking a problem/contest as AC?',
				default: getConfig().autoCommit
			}
		]);
		const config = getConfig();
		config.autoCommit = ans.autoCommit;
		updateConfig(config);
		console.log('Update config successfully'.success);
		return;
	}

	if (str && !fs.pathExistsSync(str)) {
		console.log("Path doesn't exist.".error);
		return;
	}
	if (!str) {
		const ans = await inquirer.prompt([
			{
				type: 'input',
				name: 'path',
				message: `Enter the path of the ${options.content} directory:`,
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
	config[options.content + 'Dir'] = str;
	updateConfig(config);

	console.log('Update config successfully'.success);
};
