# snowpack-plugin-angular

-   This plugin is best used with [snowpack-template-angular](https://github.com/YogliB/snowpack-template-angular)

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
