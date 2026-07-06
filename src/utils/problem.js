import fs from 'fs-extra';
import path from 'path';
import appRootPath from 'app-root-path';
import { getConfig } from './config.js';
import { getData, updateData } from './data.js';

export const addProblems = (contest, problems, { io = false, sub = false } = {}) => {
	const { contestDir } = getConfig();
	const data = getData();
	const contestPath = path.join(contestDir, contest);

	if (!data.ac[contest]) data.ac[contest] = {};

	problems.forEach((problem) => {
		let ext = getConfig().defaultLang;
		let problemName = problem;
		if (problem.includes('.')) {
			const parts = problem.split('.');
			ext = parts.pop();
			problemName = parts.join('.');
		}
		data.ac[contest][problemName] = false;

		const extTemplatePath = path.join(appRootPath.toString(), 'src', 'template', `${ext}.txt`);
		let content = '';
		if (fs.existsSync(extTemplatePath)) {
			content = fs.readFileSync(extTemplatePath, 'utf-8');
		}
		content = content.replaceAll('{name}', problemName);

		if (sub) {
			fs.mkdirSync(path.join(contestPath, problemName), { recursive: true });
			fs.writeFileSync(
				path.join(contestPath, problemName, `${problemName}.${ext}`),
				content,
			);
			if (io) {
				fs.writeFileSync(path.join(contestPath, problemName, `${problemName}.inp`), '');
				fs.writeFileSync(path.join(contestPath, problemName, `${problemName}.out`), '');
			}
		} else {
			fs.writeFileSync(
				path.join(contestPath, `${problemName}.${ext}`),
				content,
			);
			if (io) {
				fs.writeFileSync(path.join(contestPath, `${problemName}.inp`), '');
				fs.writeFileSync(path.join(contestPath, `${problemName}.out`), '');
			}
		}
	});

	updateData(data);
};

export const deleteProblems = (contest, problems) => {
	const { contestDir } = getConfig();
	const data = getData();
	const contestPath = path.join(contestDir, contest);

	problems.forEach((problemName) => {
		// Try to delete both directory (sub) and file (non-sub)
		const subDir = path.join(contestPath, problemName);
		if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
			fs.rmSync(subDir, { recursive: true });
		} else {
			// Find file with the name and any extension
			if (fs.existsSync(contestPath)) {
				const files = fs.readdirSync(contestPath);
				files.forEach(f => {
					if (f.startsWith(problemName + '.') && fs.statSync(path.join(contestPath, f)).isFile()) {
						fs.unlinkSync(path.join(contestPath, f));
					}
				});
			}
		}
		if (data.ac[contest]) {
			delete data.ac[contest][problemName];
		}
	});

	updateData(data);
};

export const markProblems = (contest, allProblems, selectedProblems) => {
	const data = getData();
	if (!data.ac[contest]) data.ac[contest] = {};
	allProblems.forEach((problemName) => {
		data.ac[contest][problemName] = selectedProblems.includes(problemName);
	});
	updateData(data);
};
