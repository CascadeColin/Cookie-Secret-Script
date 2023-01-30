require("dotenv").config();
const inquirer = require("inquirer");
const questions = require("./utils/questions");
const prompts = require("./utils/prompts");
const fn = require("./utils/functions");

const mainMenu = async () => {
  const answers = await inquirer.prompt(questions.mainMenu);
  if (answers.filetype === ".md") {
    console.log("opening markdown menu");
  } else if (answers.filetype === ".env") {
    envMenu();
    return;
  }
};

const envMenu = async () => {
  const envVars = [];
  const answers = await inquirer.prompt(questions.envType);
  switch (answers.envtype) {
    case "session secret":
      const answers = await inquirer.prompt(questions.sessionSecret);
      let key;
      if (answers.useKeyGen) {
        key = await fn.keyGenerator();
      } else {
        key = answers.secretStr;
      }
      const sessionSecret = `${answers.secretName}:${key}`;
      const addMore = await inquirer.prompt(questions.addAnotherEnv);
      if (!addMore.addEnvVars) {
        fn.writeEnvFile(sessionSecret);
        console.log("\x1b[1m%s\x1b[0m", "\n     .env file created!\n")
      } else {
        envVars.push(sessionSecret);
        const formattedVars = await fn.formatEnvVars(envVars);
        console.log(formattedVars)
      }
      break;
    case "database info":
      console.log("open db menu");
      break;
    case "API key":
      console.log("opening api menu");
      break;
  }
  return;
};

const mdMenu = () => {};

mainMenu();
