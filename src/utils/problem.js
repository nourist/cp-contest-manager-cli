import fs from 'fs-extra';
import path from 'path';
import appRootPath from 'app-root-path';
import { getConfig } from './config.js';
import { getData, updateData } from './data.js';

export const addProblems = (contest, problems, { io = false, sub = false } = {}) => {
	const { contestDir } = getConfig();
	const data = getData();
	const contestPath = path.join(contestDir, contest);
	const testDir = path.join(contestPath, 'test');
	if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

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

		const testTemplatePath = path.join(appRootPath.toString(), 'src', 'template', `${ext}_test.txt`);
		let testContent = '';
		if (fs.existsSync(testTemplatePath)) {
			testContent = fs.readFileSync(testTemplatePath, 'utf-8');
		}
		testContent = testContent.replaceAll('{name}', problemName);

		fs.writeFileSync(path.join(testDir, `${problemName}_test.${ext}`), testContent);
		fs.writeFileSync(path.join(testDir, `${problemName}_1.${ext}`), content);
		fs.writeFileSync(path.join(testDir, `${problemName}_2.${ext}`), content);

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
	const testDir = path.join(contestPath, 'test');

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

		if (fs.existsSync(testDir)) {
			const files = fs.readdirSync(testDir);
			files.forEach(f => {
				if (f.startsWith(problemName + '_') && fs.statSync(path.join(testDir, f)).isFile()) {
					fs.unlinkSync(path.join(testDir, f));
				}
			});
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

export const getProblemFilePath = (contest, problemName) => {
	const { contestDir } = getConfig();
	const contestPath = path.join(contestDir, contest);
	const subDir = path.join(contestPath, problemName);
	
	if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
		const files = fs.readdirSync(subDir);
		const codeFile = files.find(f => f.startsWith(problemName + '.') && ['.cpp', '.c', '.py', '.java', '.js'].includes(path.extname(f)));
		if (codeFile) return path.join(subDir, codeFile);
	} else {
		const files = fs.readdirSync(contestPath);
		const codeFile = files.find(f => f.startsWith(problemName + '.') && ['.cpp', '.c', '.py', '.java', '.js'].includes(path.extname(f)));
		if (codeFile) return path.join(contestPath, codeFile);
	}
	return null;
};

export const renameProblem = (contest, oldName, newName) => {
	const { contestDir } = getConfig();
	const data = getData();
	const contestPath = path.join(contestDir, contest);
	const testDir = path.join(contestPath, 'test');
	
	const subDir = path.join(contestPath, oldName);
	if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
		const newSubDir = path.join(contestPath, newName);
		fs.renameSync(subDir, newSubDir);
		const files = fs.readdirSync(newSubDir);
		files.forEach(f => {
			if (f.startsWith(oldName + '.')) {
				const ext = path.extname(f);
				fs.renameSync(path.join(newSubDir, f), path.join(newSubDir, newName + ext));
			}
		});
	} else {
		const files = fs.readdirSync(contestPath);
		files.forEach(f => {
			if (f === 'test') return;
			if (f.startsWith(oldName + '.') && fs.statSync(path.join(contestPath, f)).isFile()) {
				const ext = path.extname(f);
				fs.renameSync(path.join(contestPath, f), path.join(contestPath, newName + ext));
			}
		});
	}

	if (fs.existsSync(testDir)) {
		const files = fs.readdirSync(testDir);
		files.forEach(f => {
			if (f.startsWith(oldName + '_') && fs.statSync(path.join(testDir, f)).isFile()) {
				const suffix = f.substring(oldName.length);
				fs.renameSync(path.join(testDir, f), path.join(testDir, newName + suffix));
			}
		});
	}

	if (data.ac[contest] && data.ac[contest][oldName] !== undefined) {
		data.ac[contest][newName] = data.ac[contest][oldName];
		delete data.ac[contest][oldName];
		updateData(data);
	}
};

export const moveProblem = (fromContest, toContest, problemName) => {
	const { contestDir } = getConfig();
	const data = getData();
	
	const fromPath = path.join(contestDir, fromContest);
	const toPath = path.join(contestDir, toContest);
	const fromTestDir = path.join(fromPath, 'test');
	const toTestDir = path.join(toPath, 'test');
	
	if (!fs.existsSync(toTestDir)) fs.mkdirSync(toTestDir);

	const subDirTo = path.join(toPath, problemName);
	let existsInTarget = false;
	if (fs.existsSync(subDirTo)) existsInTarget = true;
	const filesInTo = fs.readdirSync(toPath);
	if (filesInTo.some(f => f.startsWith(problemName + '.') && fs.statSync(path.join(toPath, f)).isFile())) existsInTarget = true;
	
	if (existsInTarget) {
		throw new Error(`Problem ${problemName} already exists in ${toContest}`);
	}

	const subDirFrom = path.join(fromPath, problemName);
	if (fs.existsSync(subDirFrom) && fs.statSync(subDirFrom).isDirectory()) {
		fs.renameSync(subDirFrom, subDirTo);
	} else {
		const files = fs.readdirSync(fromPath);
		files.forEach(f => {
			if (f === 'test') return;
			if (f.startsWith(problemName + '.') && fs.statSync(path.join(fromPath, f)).isFile()) {
				fs.renameSync(path.join(fromPath, f), path.join(toPath, f));
			}
		});
	}

	if (fs.existsSync(fromTestDir)) {
		const files = fs.readdirSync(fromTestDir);
		files.forEach(f => {
			if (f.startsWith(problemName + '_') && fs.statSync(path.join(fromTestDir, f)).isFile()) {
				fs.renameSync(path.join(fromTestDir, f), path.join(toTestDir, f));
			}
		});
	}

	if (!data.ac[toContest]) data.ac[toContest] = {};
	if (data.ac[fromContest] && data.ac[fromContest][problemName] !== undefined) {
		data.ac[toContest][problemName] = data.ac[fromContest][problemName];
		delete data.ac[fromContest][problemName];
		updateData(data);
	}
};
