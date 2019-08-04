#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version
const chalk = require("chalk");
const semver = require("semver"); //版本规范,语义化版本
const requiredVersion = require("../package.json").engines.node;
const didYouMean = require("didyoumean"); //匹配引擎,提示相似
// Setting edit distance to 60% of the input string's length
didYouMean.threshold = 0.6;

//检测版本
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        "You are using Node " +
          process.version +
          ", but this version of " +
          id +
          " requires Node " +
          wanted +
          ".\nPlease upgrade your Node version."
      )
    );
    process.exit(1);
  }
}

checkNodeVersion(requiredVersion, "ycloud-cli");

if (semver.satisfies(process.version, "9.x")) {
  console.log(
    chalk.red(
      `You are using Node ${process.version}.\n` +
        `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n` +
        `It's strongly recommended to use an active LTS version instead.`
    )
  );
}

const fs = require("fs");
const path = require("path");
const slash = require("slash"); //统一斜杠
const minimist = require("minimist"); //node参数解析器
const program = require("commander");

program.version(require("../package").version).usage("<command> [options]");

program
  .command("create <app-name>")
  .description("create a new project powered by ycloud-cli-service")
  .action((name, cmd) => {
    const options = cleanArgs(cmd);
    //检测参数
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(
        chalk.yellow(
          "\n Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored."
        )
      );
    }
    console.log(require("../lib/create.js"),'2313213')
    require("../lib/create")(name, options);
  });

// output help information on unknown commands
program.arguments("<command>").action(cmd => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
  suggestCommands(cmd);
});
// add some useful info on help
program.on("--help", () => {
  console.log();
  console.log(
    `  Run ${chalk.cyan(
      `ycloud <command> --help`
    )} for detailed usage of given command.`
  );
  console.log();
});

program.commands.forEach(c => c.on("--help", () => console.log()));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

function suggestCommands(cmd) {
  const availableCommands = program.commands.map(cmd => {
    return cmd._name;
  });

  const suggestion = didYouMean(cmd, availableCommands);
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}
// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ""));
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key];
    }
  });
  return args;
}
