/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	plugins: ['snowpack-plugin-angular'],
	routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
};
