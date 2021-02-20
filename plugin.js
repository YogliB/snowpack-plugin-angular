const execa = require('execa');
const npmRunPath = require('npm-run-path');
const cwd = process.cwd();

function angularPlugin(_, { args } = {}) {
	/**
	 * @type {import('snowpack').SnowpackPlugin}
	 */
	const plugin = {
		name: 'snowpack-plugin-angular',
		async run({ isDev, log }) {
			// START run `ngc` in watch mode
			const workerPromise = execa.command(
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
			const { stdout, stderr } = workerPromise;

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
				log('WORKER_MSG', { level: 'log', msg: stdOutput });
			}

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

			return transpiledContent.trim() || contents;
		},
	};

	return plugin;
}

module.exports = angularPlugin;
