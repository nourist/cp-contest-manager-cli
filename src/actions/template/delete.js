import path from 'path';
import appRootPath from 'app-root-path';
import fs from 'fs-extra';
import inquirer from 'inquirer';

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
			console.log('No templates found.'.yellow);
			return;
		}

		const ans = await inquirer.prompt([
			{
				type: 'list',
				name: 'ext',
				message: 'Select a template to delete:',
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

	const confirmAns = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'confirm',
			message: `Are you sure you want to delete the ${ext} template?`,
			default: false,
		},
	]);

	if (confirmAns.confirm) {
		fs.unlinkSync(templatePath);
		console.log(`Deleted template for ${ext} successfully.`.success);
	} else {
		console.log('Deletion cancelled.'.yellow);
	}
};
