import { execSync } from 'child_process';
import path from 'path';
import appRootPath from 'app-root-path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { getConfig } from '../../utils/config.js';

export default async (ext) => {
	const templateDir = path.join(
		appRootPath.toString(),
		'src',
		'template',
	);

	if (!ext) {
		const files = fs
			.readdirSync(templateDir)
			.filter((f) => f.endsWith('.txt'));
		const exts = files.map((f) => f.replace('.txt', ''));

		if (exts.length === 0) {
			console.log(
				'No templates found. Please create one first.'.yellow,
			);
			return;
		}

		const ans = await inquirer.prompt([
			{
				type: 'list',
				name: 'ext',
				message: 'Select a template to edit:',
				choices: exts,
			},
		]);
		ext = ans.ext;
	}

	const templatePath = path.join(templateDir, `${ext}.txt`);

	if (!fs.existsSync(templatePath)) {
		console.log(`Template file for ${ext} does not exist!`.error);
		return;
	}

	const { editor } = getConfig();
	console.log(`Opening template file in ${editor}...`.cyan);
	try {
		const cmd = editor === 'zed' ? `zed "${templatePath}"` : `code "${templatePath}"`;
		execSync(cmd, { stdio: 'inherit' });
	} catch (e) {
		console.log(
			`Failed to open editor. Please make sure \`${editor === 'zed' ? 'zed' : 'code'}\` command is available in your PATH.`
				.error,
		);
	}
};
