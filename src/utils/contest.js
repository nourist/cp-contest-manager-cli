import fs from 'fs-extra';
import path from 'path';

import { getConfig } from './config.js';
import { getData, updateData } from './data.js';
import { getLastUpdate, getSources, exportSources } from './file.js';
import cpp from '../template/cpp.js';

export const getProblems = (contest) => {
	const { contestDir } = getConfig();

	const problems = getSources(path.join(contestDir, contest));
	return problems.map((item) => path.basename(item, path.extname(item)));
};

export const getContest = (name) => {
	const { contestDir } = getConfig();
	const { ac } = getData();

	if (!fs.pathExistsSync(path.join(contestDir, name))) {
		return null;
	}

	return {
		name,
		ac: ac[name] || false,
		problems: getProblems(name),
		lastUpdate: getLastUpdate(path.join(contestDir, name)),
	};
};

export const getContests = ({ ac: acRequired = false } = {}) => {
	const { contestDir } = getConfig();
	const { ac } = getData();

	let items = fs.readdirSync(contestDir);

	items = items.filter((item) => {
		if (acRequired && !ac[item]) {
			return false;
		}

		const fullPath = path.join(contestDir, item);
		const stats = fs.statSync(fullPath);

		return stats.isDirectory();
	});

	return items.map((item) => {
		return {
			name: item,
			ac: ac[item] || false,
			problems: getProblems(item),
			lastUpdate: getLastUpdate(path.join(contestDir, item)),
		};
	});
};

export const createContest = (
	name,
	problems,
	{ io = false, sub = false } = {},
) => {
	const { contestDir } = getConfig();
	const data = getData();

	const contestPath = path.join(contestDir, name);
	fs.mkdirSync(contestPath);

	problems.forEach((problem) => {
		if (sub) {
			fs.mkdirSync(path.join(contestPath, problem));
			fs.writeFileSync(
				path.join(contestPath, problem, `${problem}.cpp`),
				cpp.replace('{name}', problem),
			);
			if (io) {
				fs.writeFileSync(
					path.join(contestPath, problem, `${problem}.inp`),
					'',
				);
				fs.writeFileSync(
					path.join(contestPath, problem, `${problem}.out`),
					'',
				);
			}
		} else {
			fs.writeFileSync(
				path.join(contestPath, `${problem}.cpp`),
				cpp.replace('{name}', problem),
			);
			if (io) {
				fs.writeFileSync(
					path.join(contestPath, `${problem}.inp`),
					'',
				);
				fs.writeFileSync(
					path.join(contestPath, `${problem}.out`),
					'',
				);
			}
		}
	});

	data.ac[name] = false;
	updateData(data);
};

export const deleteContest = (name) => {
	const { contestDir } = getConfig();
	const data = getData();

	if (fs.pathExistsSync(path.join(contestDir, name))) {
		fs.rmSync(path.join(contestDir, name), {
			recursive: true,
		});
	}

	data.ac[name] = undefined;
	updateData(data);
};

export const markContest = (name, ac = true) => {
	const data = getData();
	data.ac[name] = ac;
	updateData(data);
};

export const exportContest = (name) => {
	const { contestDir, exportDir } = getConfig();

	if (fs.pathExistsSync(path.join(contestDir, name))) {
		fs.mkdirSync(path.join(exportDir, name));
		exportSources(
			path.join(contestDir, name),
			path.join(exportDir, name),
		);
	}
};
