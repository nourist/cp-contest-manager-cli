import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import { rootDir } from './constant.js';
import template from './template.js';
import { getData, updateData } from './utils.js';

export const isExistContest = (name) => {
	const data = getData();
	return data.contests.some((contest) => contest.name == name);
};

export const createContest = (name, tasks = [], sub = false) => {
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
			fs.writeFileSync(path.join(rootDir, name, task, `${task}.inp`), '');
			fs.writeFileSync(path.join(rootDir, name, task, `${task}.out`), '');
		} else {
			fs.writeFileSync(
				path.join(rootDir, name, `${task}.cpp`),
				template.replaceAll('{name}', task),
			);
			fs.writeFileSync(path.join(rootDir, name, `${task}.inp`), '');
			fs.writeFileSync(path.join(rootDir, name, `${task}.out`), '');
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
