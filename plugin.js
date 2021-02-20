const { command, commandSync } = require('execa');
const npmRunPath = require('npm-run-path');
const cwd = process.cwd();
const { access } = require('fs/promises');

function angularPlugin(_, { args } = {}) {
	/**
	 * @type {import('snowpack').SnowpackPlugin}
	 */
	const plugin = {
		name: 'snowpack-plugin-angular',
		async run({ isDev, log }) {
			function dataListener(chunk) {
				let stdOutput = chunk.toString();
				// In --watch mode, handle the "clear" character
				if (
					stdOutput.includes('\u001bc') ||
					stdOutput.includes('\x1Bc')
				) {
					log('WORKER_RESET', {});
					stdOutput = stdOutput
						.replace(/\x1Bc/, '')
						.replace(/\u001bc/, '');
				}
				log('WORKER_MSG', { level: 'log', msg: `${stdOutput}` });
			}

			if (await access('./node_modules/.bin/ngcc')) {
				let { stdout, stderr } = commandSync('ngcc', {
					env: npmRunPath.env(),
					extendEnv: true,
					windowsHide: false,
					cwd,
				});

				if (stdout && stdout.trim()) dataListener(stdout);
				if (stderr && stderr.trim()) dataListener(stderr);
			}

			// START run `ngc` in watch mode
			const workerPromise = command(
				`ngc ${args || '--project ./tsconfig.app.json'} ${
					isDev ? '--watch' : ''
				}`,
				{
					env: npmRunPath.env(),
					extendEnv: true,
					windowsHide: false,
					cwd,
				}
			);
			({ stdout, stderr } = workerPromise);

			stdout && stdout.on('data', dataListener);
			stderr && stderr.on('data', dataListener);

			return workerPromise;
		},
		transform({ contents, fileExt, isDev }) {
			if (isDev || fileExt.trim() !== '.js' || !contents.trim())
				return contents;

			const {
				buildOptimizer,
			} = require('@angular-devkit/build-optimizer');

			const transpiledContent = buildOptimizer({ content: contents })
				.content;

			return transpiledContent || contents;
		},
	};

	return plugin;
}

module.exports = angularPlugin;
