import fs from 'fs-extra';
import path from 'path';

import { getConfig } from './config.js';

export const dataTemplate = { ac: {} };
export const dataFileName = 'data.json';

export const updateData = (data = dataTemplate) => {
	const { contestDir } = getConfig();

	fs.writeFileSync(
		path.join(contestDir, dataFileName),
		JSON.stringify(data),
	);
};

export const getData = () => {
	const { contestDir } = getConfig();

	if (
		!fs.existsSync(path.join(contestDir, dataFileName))
	) {
		updateData();
	}

	return JSON.parse(
		fs.readFileSync(
			path.join(contestDir, dataFileName),
		),
	);
};
