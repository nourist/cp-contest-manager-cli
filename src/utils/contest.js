import fs from 'fs-extra';
import path from 'path';

import { getConfig } from './config.js';
import { getData, updateData } from './data.js';
import cpp from '../template/cpp.js';

export const getSources = (dir) => {
	const items = fs.readdirSync(dir);

	const res = [];

	items.forEach((item) => {
		const fullPath = path.join(dir, item);
		const stats = fs.statSync(fullPath);
		const ext = path.extname(item);

		if (stats.isDirectory()) {
			res.push(...getSources(fullPath));
		} else if (ext === '.cpp' || ext === '.c' || ext === '.py') {
			res.push(path.basename(item, ext));
		}
	});

	return res;
};

export const exportSources = (dir, dest) => {
	const items = fs.readdirSync(dir);

	items.forEach((item) => {
		const fullPath = path.join(dir, item);
		const stats = fs.statSync(fullPath);
		const ext = path.extname(item);

		if (stats.isDirectory()) {
			exportSources(fullPath, dest);
		} else if (ext === '.cpp' || ext === '.c' || ext === '.py') {
			fs.copyFileSync(fullPath, path.join(dest, item));
		}
	});
};

export const getProblems = (contest) => {
	const { contestDir } = getConfig();

	const problems = getSources(path.join(contestDir, contest));
	return problems.map((item) =>
		path.basename(item, path.extname(item)),
	);
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
	};
};

export const getContests = () => {
	const { contestDir } = getConfig();
	const { ac } = getData();

	const items = fs.readdirSync(contestDir);

	items.filter((item) => {
		const fullPath = path.join(contestDir, item);
		const stats = fs.statSync(fullPath);

		return stats.isDirectory();
	});

	return items.map((item) => {
		return {
			name: item,
			ac: ac[item] || false,
			problems: getProblems(item),
		};
	});
};

export const createContest = (
	name,
	problems,
	{ io = false, sub = false },
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
		fs.rmdirSync(path.join(contestDir, name), {
			recursive: true,
		});
	}

	data.ac[name] = undefined;
	updateData(data);
};

export const markContest = (name, ac) => {
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
