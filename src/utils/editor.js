import { exec, execSync } from 'child_process';
import { getConfig } from './config.js';

/**
 * Build the shell command string to open `targetPath` in the configured editor.
 * Paths are always wrapped in double quotes to handle spaces correctly on both
 * Windows and Linux.
 *
 * @param {string} targetPath - The file or directory to open.
 * @param {boolean} [reuse=false]  - For VS Code: pass -r to reuse the current window (used when opening a directory).
 * @returns {string} Shell command string.
 */
const buildCmd = (targetPath, reuse = false) => {
	const { editor } = getConfig();
	// Escape any existing double quotes in the path (edge case)
	const safePath = targetPath.replace(/"/g, '\\"');
	if (editor === 'zed') {
		return `zed "${safePath}"`;
	}
	// VS Code
	return reuse ? `code -r "${safePath}"` : `code "${safePath}"`;
};

/**
 * Open a path in the configured editor asynchronously (fire-and-forget).
 * Suitable for opening directories / contests where we don't need to wait.
 *
 * @param {string} targetPath
 * @param {boolean} [reuse=false]
 */
export const openEditorAsync = (targetPath, reuse = false) => {
	const cmd = buildCmd(targetPath, reuse);
	// exec() always spawns through the system shell, which resolves .cmd on Windows
	exec(cmd, (err) => {
		if (err) {
			const { editor } = getConfig();
			const bin = editor === 'zed' ? 'zed' : 'code';
			console.log(
				`Failed to open editor. Is \`${bin}\` command available in your PATH?`
					.error,
			);
		}
	});
};

/**
 * Open a path in the configured editor synchronously (waits for command to exit).
 * Suitable for opening single files where we want to block until done.
 *
 * On Windows, `code` is a batch script (code.cmd), so we need shell:true.
 * On Linux, shell:true is harmless.
 *
 * @param {string} targetPath
 * @param {boolean} [reuse=false]
 */
export const openEditorSync = (targetPath, reuse = false) => {
	const cmd = buildCmd(targetPath, reuse);
	const { editor } = getConfig();
	const bin = editor === 'zed' ? 'zed' : 'code';
	try {
		execSync(cmd, { stdio: 'inherit', shell: true });
	} catch (e) {
		console.log(
			`Failed to open editor. Is \`${bin}\` command available in your PATH?`
				.error,
		);
	}
};
