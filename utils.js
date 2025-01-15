import fs from 'fs-extra';
import path from 'path';

import { rootDir } from './constant.js';

export const getData = () => {
	const res = fs.readFileSync(path.join(rootDir, 'data.json'));
	return JSON.parse(res);
};

export const updateData = (data = {}) => {
	fs.writeFileSync(
		path.join(rootDir, 'data.json'),
		JSON.stringify(data),
	);
};

export const getConfig = () => {
	const res = fs.readFileSync(path.join(rootDir, 'config.json'));
	return JSON.parse(res);
};

export const updateConfig = (config = {}) => {
	fs.writeFileSync(
		path.join(rootDir, 'config.json'),
		JSON.stringify(config),
	);
};

export const copySource = (source, dest) => {
	const items = fs.readdirSync(source);

	for (const item of items) {
		const sourceItemPath = path.join(source, item);
		const destItemPath = path.join(dest, item);

		const ext = path.extname(item);
		const stats = fs.statSync(sourceItemPath);

		if (stats.isDirectory()) {
			copySource(sourceItemPath, dest);
		} else if (ext === '.cpp' || ext === '.py') {
			fs.copySync(sourceItemPath, destItemPath);
		}
	}
};
