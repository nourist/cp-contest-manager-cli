import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import { rootDir } from './constant.js';
import template from './template.js';
import {
	getData,
	updateData,
	getConfig,
	copySource,
} from './utils.js';

export const isExistContest = (name) => {
	const data = getData();
	return data.contests.some((contest) => contest.name == name);
};

export const createContest = (
	name,
	tasks = [],
	sub = false,
	io = false,
) => {
	if (!fs.existsSync(path.join(rootDir, name))) {
		fs.mkdirSync(path.join(rootDir, name));
	}

	const data = getData();

	data.contests.push({
		name,
		createAt: Date.now(),
		numberOfTask: tasks.length,
		tasksName: tasks.join(' '),
		sub,
		ac: false,
	});

	updateData(data);

	tasks.forEach((task) => {
		if (sub) {
			if (!fs.existsSync(path.join(rootDir, name, task))) {
				fs.mkdirSync(path.join(rootDir, name, task));
			}
			fs.writeFileSync(
				path.join(rootDir, name, task, `${task}.cpp`),
				template.replaceAll('{name}', task),
			);
			if (io) {
				fs.writeFileSync(
					path.join(rootDir, name, task, `${task}.inp`),
					'',
				);
				fs.writeFileSync(
					path.join(rootDir, name, task, `${task}.out`),
					'',
				);
			}
		} else {
			fs.writeFileSync(
				path.join(rootDir, name, `${task}.cpp`),
				template.replaceAll('{name}', task),
			);
			if (io) {
				fs.writeFileSync(
					path.join(rootDir, name, `${task}.inp`),
					'',
				);
				fs.writeFileSync(
					path.join(rootDir, name, `${task}.out`),
					'',
				);
			}
		}
	});
};

export const deleteContest = (name) => {
	const data = getData();
	data.contests = data.contests.filter((contest) => {
		return contest.name != name;
	});

	updateData(data);

	if (fs.existsSync(path.join(rootDir, name))) {
		fsExtra.emptyDirSync(path.join(rootDir, name));
		fs.rmdirSync(path.join(rootDir, name));
	}
};

export const markContest = (name, ac) => {
	const data = getData();

	data.contests.forEach((contest, index) => {
		if (contest.name == name) {
			data.contests[index].ac = ac;
		}
	});

	updateData(data);
};

export const renameContest = (name, newName) => {
	const data = getData();

	data.contests.forEach((contest, index) => {
		if (contest.name == name) {
			data.contests[index].name = newName;
		}
	});

	updateData(data);
	fs.renameSync(
		path.join(rootDir, name),
		path.join(rootDir, newName),
	);
};

export const exportContest = (name) => {
	const config = getConfig();

	const source = path.join(rootDir, name);
	const dest = path.join(config.exportDir, name);

	copySource(source, dest);
};
