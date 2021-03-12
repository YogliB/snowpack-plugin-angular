# Moved

This plugin has been moved and is now managed at the [snowpack-angular](https://github.com/YogliB/snowpack-angular/tree/main/packages/plugin) monorepo. Please update your dependencies. This repository is no longer maintained.

# snowpack-plugin-angular

-   This plugin is best used with [snowpack-template-angular](https://github.com/YogliB/snowpack-template-angular)

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE-OF-CONDUCT.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![npm package version](https://badgen.net/npm/v/snowpack-plugin-angular)](https://npm.im/snowpack-plugin-angular)
[![install size](https://badgen.net/packagephobia/install/snowpack-plugin-angular)](https://packagephobia.now.sh/result?p=snowpack-plugin-angular)

When developing or building your site with Snowpack, this plugin will run Angular's [`ngc`](https://angular.io/guide/aot-compiler) CLI in your project and pipe the output through Snowpack.

## Usage

```bash
npm i --save-dev snowpack-plugin-angular
```

Then add the plugin to your Snowpack config:

```js
// snowpack.config.js

module.exports = {
	plugins: ['snowpack-plugin-angular'],
};
```

## Plugin Options

| Name   |   Type   | Description                                                                                                                                                                               |
| :----- | :------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `args` | `string` | Optional arguments to pass to the `ngc` CLI. For example, you can configure a custom project directory (with a custom `tsconfig.json` file) using `args: "--project ./your/custom/path"`. |
