import fs from 'fs-extra';
import path from 'path';

import { getConfig } from './config.js';
import { getSources } from './file.js';

export const dataTemplate = { ac: {} };
export const dataFileName = 'data.json';

export const updateData = (data = dataTemplate) => {
	const { contestDir } = getConfig();

	fs.writeFileSync(
		path.join(contestDir, dataFileName),
		JSON.stringify(data, null, 2),
	);
};

export const getData = () => {
	const { contestDir } = getConfig();

	if (!fs.existsSync(path.join(contestDir, dataFileName))) {
		updateData();
	}

	const data = JSON.parse(
		fs.readFileSync(path.join(contestDir, dataFileName)),
	);

	let changed = false;
	for (const contest in data.ac) {
		if (typeof data.ac[contest] === 'boolean') {
			const oldStatus = data.ac[contest];
			data.ac[contest] = {};
			const contestPath = path.join(contestDir, contest);
			if (fs.existsSync(contestPath)) {
				const problems = getSources(contestPath).map(p => path.basename(p, path.extname(p)));
				for (const p of problems) {
					data.ac[contest][p] = oldStatus;
				}
			}
			changed = true;
		}
	}

	if (changed) {
		updateData(data);
	}

	return data;
};
