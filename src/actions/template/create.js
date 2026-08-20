import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { getTemplateDir } from '../../utils/config.js';

export default async (ext) => {
	const templateDir = getTemplateDir();

	if (!ext) {
		const ans = await inquirer.prompt([
			{
				type: 'input',
				name: 'ext',
				message:
					'Enter the new template extension (e.g., py, java):',
				validate: (val) =>
					val.trim() ? true : 'Please enter a valid extension',
			},
		]);
		ext = ans.ext.trim().replace(/^\./, '');
	}

	const templatePath = path.join(templateDir, `${ext}.txt`);

	if (fs.existsSync(templatePath)) {
		console.log(
			`Template file for ${ext} already exists! Use 'edit' instead.`
				.yellow,
		);
		return;
	}

	console.log(`Creating new template for ${ext}...`.cyan);
	fs.writeFileSync(templatePath, '');
	console.log(
		`Template for ${ext} created successfully! Run 'cpm template edit ${ext}' to modify it.`
			.success,
	);
};
