/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		public: '/',
	},
	plugins: ['snowpack-plugin-angular'],
	routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
	alias: {
		styles: './public/styles',
	},
};
