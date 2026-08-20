import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { openEditorSync } from '../../utils/editor.js';
import { getTemplateDir } from '../../utils/config.js';

export default async (ext) => {
	const templateDir = getTemplateDir();

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

	console.log(`Opening template file...`.cyan);
	openEditorSync(templatePath);
};

