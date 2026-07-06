import fs from 'fs-extra';
import path from 'path';

import { getConfig } from './config.js';
import { getData, updateData } from './data.js';
import {
	getLastUpdate,
	getSources,
	exportSources,
	renameSources,
} from './file.js';
import appRootPath from 'app-root-path';

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

	const problemAc = ac[name] || {};
	const problemsList = getProblems(name);
	const isAc = problemsList.length > 0 && problemsList.every((p) => problemAc[p]);

	return {
		name,
		ac: isAc,
		problemAc: problemAc,
		problems: problemsList,
		lastUpdate: getLastUpdate(path.join(contestDir, name)),
	};
};

export const getContests = ({ ac: acRequired = false } = {}) => {
	const { contestDir } = getConfig();
	const { ac } = getData();

	let items = fs.readdirSync(contestDir);

	items = items.filter((item) => {
		let isAc = false;
		if (ac[item]) {
			const problemsList = getProblems(item);
			isAc = problemsList.length > 0 && problemsList.every((p) => ac[item][p]);
		}

		if (acRequired && !isAc) {
			return false;
		}

		const fullPath = path.join(contestDir, item);
		const stats = fs.statSync(fullPath);

		return stats.isDirectory();
	});

	return items.map((item) => {
		const problemAc = ac[item] || {};
		const problemsList = getProblems(item);
		const isAc = problemsList.length > 0 && problemsList.every((p) => problemAc[p]);
		
		return {
			name: item,
			ac: isAc,
			problemAc: problemAc,
			problems: problemsList,
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

	data.ac[name] = {};

	problems.forEach((problem) => {
		let ext = getConfig().defaultLang;
		let problemName = problem;
		if (problem.includes('.')) {
			const parts = problem.split('.');
			ext = parts.pop();
			problemName = parts.join('.');
		}
		data.ac[name][problemName] = false;

		const extTemplatePath = path.join(appRootPath.toString(), 'src', 'template', `${ext}.txt`);
		let content = '';
		if (fs.existsSync(extTemplatePath)) {
			content = fs.readFileSync(extTemplatePath, 'utf-8');
		}
		content = content.replaceAll('{name}', problemName);

		if (sub) {
			fs.mkdirSync(path.join(contestPath, problemName));
			fs.writeFileSync(
				path.join(contestPath, problemName, `${problemName}.${ext}`),
				content,
			);
			if (io) {
				fs.writeFileSync(
					path.join(contestPath, problemName, `${problemName}.inp`),
					'',
				);
				fs.writeFileSync(
					path.join(contestPath, problemName, `${problemName}.out`),
					'',
				);
			}
		} else {
			fs.writeFileSync(
				path.join(contestPath, `${problemName}.${ext}`),
				content,
			);
			if (io) {
				fs.writeFileSync(
					path.join(contestPath, `${problemName}.inp`),
					'',
				);
				fs.writeFileSync(
					path.join(contestPath, `${problemName}.out`),
					'',
				);
			}
		}
	});

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
	if (!data.ac[name]) data.ac[name] = {};
	const problems = getProblems(name);
	problems.forEach((p) => {
		data.ac[name][p] = ac;
	});
	updateData(data);
};

export const renameContest = (oldName, newName) => {
	const { contestDir } = getConfig();
	const data = getData();

	if (fs.pathExistsSync(path.join(contestDir, oldName))) {
		fs.renameSync(
			path.join(contestDir, oldName),
			path.join(contestDir, newName),
		);
	}

	data[newName] = data[oldName];
	data[oldName] = undefined;
	updateData(data);
};

export const renameProblems = (contest, oldName, newName) => {
	const { contestDir } = getConfig();

	renameSources(path.join(contestDir, contest), oldName, newName);
};

export const exportContest = (name) => {
	const { contestDir, exportDir } = getConfig();

	if (fs.pathExistsSync(path.join(contestDir, name))) {
		if (!fs.pathExistsSync(path.join(exportDir, name))) {
			fs.mkdirSync(path.join(exportDir, name));
		}
		exportSources(
			path.join(contestDir, name),
			path.join(exportDir, name),
		);
	}
};
