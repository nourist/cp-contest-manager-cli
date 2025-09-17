import envPaths from 'env-paths';
import fs from 'fs';
import path from 'path';

import { appName } from '../constants';

const paths = envPaths(appName);
const templateDir = path.join(paths.data, 'templates');

export const ensureDefaultTemplates = () => {
	if (!fs.existsSync(templateDir)) {
		fs.mkdirSync(templateDir, { recursive: true });
	}

	const defaultTemplatesPath = path.join(__dirname, '../templates');

	const defaultTemplates = fs.readdirSync(defaultTemplatesPath).filter((file) => path.parse(file).ext == '.txt');
	defaultTemplates.forEach((file) => {
		const filePath = path.join(templateDir, file);
		if (!fs.existsSync(filePath)) {
			const content = fs.readFileSync(path.join(defaultTemplatesPath, file), 'utf-8');
			fs.writeFileSync(filePath, content, 'utf-8');
		}
	});
};

export const getAllTemplates = () => {
	const templates = fs
		.readdirSync(templateDir)
		.filter((file) => path.parse(file).ext == '.txt')
		.map((file) => {
			const filePath = path.join(templateDir, file);
			const content = fs.readFileSync(filePath, 'utf-8');
			return {
				name: path.parse(file).name,
				content,
			};
		});
	return templates;
};

export const getTemplate = (name) => {
	const filePath = path.join(templateDir, name + '.txt');
	if (!fs.existsSync(filePath)) {
		return null;
	}
	const content = fs.readFileSync(filePath, 'utf-8');
	return content;
};

export const saveTemplate = (name, content) => {
	if (!fs.existsSync(templateDir)) {
		fs.mkdirSync(templateDir, { recursive: true });
	}
	const filePath = path.join(templateDir, name + '.txt');
	fs.writeFileSync(filePath, content, 'utf-8');
};
