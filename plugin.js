const execa = require("execa");
const npmRunPath = require("npm-run-path");
const cwd = process.cwd();
const fse = require("fs-extra");

function angularPlugin(_, { ngcArgs, ngccArgs } = {}) {
  return {
    name: "snowpack-plugin-angular",
    async run({ isDev, log }) {
      // START run `ngc` in watch mode
      const workerPromise = execa.command(
        `ngc ${ngcArgs || "--project ./tsconfig.app.json"} ${
          isDev ? "--watch" : ""
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
        if (stdOutput.includes("\u001bc") || stdOutput.includes("\x1Bc")) {
          log("WORKER_RESET", {});
          stdOutput = stdOutput.replace(/\x1Bc/, "").replace(/\u001bc/, "");
        }
        log("WORKER_MSG", { level: "log", msg: stdOutput });
      }

      stdout && stdout.on("data", dataListener);
      stderr && stderr.on("data", dataListener);
      // END run `ngc` in watch mode

      // run `ngcc`
      execa.commandSync(
        `ngcc ${ngccArgs || "--tsconfig ./tsconfig.app.json"}`,
        {
          cwd,
          env: npmRunPath.env(),
          extendEnv: true,
          windowsHide: false,
          stdio: "inherit",
        }
      );

      // copy `ngcc`-processed files to `web_modules`
      execa.commandSync("snowpack install", {
        env: npmRunPath.env(),
        extendEnv: true,
        windowsHide: false,
        cwd,
        stdio: "inherit",
      });

      // move `web_modules` to `.cache` directory
      const srcDir = "web_modules";
      const destDir = `node_modules/.cache/snowpack/development`;

      fse.rmdirSync(destDir, { recursive: true });
      fse.moveSync(srcDir, destDir, { overwrite: true });

      // run `ngc` once before --watch mode
      execa.commandSync(`ngc ${ngcArgs || "--project ./tsconfig.app.json"}`, {
        env: npmRunPath.env(),
        extendEnv: true,
        windowsHide: false,
        cwd,
        stdio: "inherit",
      });

      return workerPromise;
    },
  };
}

module.exports = angularPlugin;
