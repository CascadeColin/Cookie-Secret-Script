require("dotenv").config();
const inquirer = require("inquirer");
const questions = require("./utils/questions");
const prompts = require("./utils/prompts");
const fn = require("./utils/functions");

const mainMenu = async () => {
  //   const answers = await inquirer.prompt(questions.mainMenu);
  const answers = await fn.menu();
  if (answers.filetype === ".md") {
    console.log("");
    // TODO: open markdown menu
  } else if (answers.filetype === ".env") {
    console.log("");
    envMenu();
    return;
  }
};

//TODO: works well, but needs a refactor
const envMenu = async () => {
  const envVars = [];
  const envData = async () => {
    const answers = await fn.envType();
    switch (answers.envtype) {
      case "session secret":
        const answers = await fn.sessionSecret();
        let key;
        if (answers.useKeyGen) {
          key = await fn.keyGenerator();
        } else {
          key = await answers.secretStr;
        }
        const sessionSecret = await `${answers.secretName}: '${key}'`;
        await envVars.push(sessionSecret);
        if (answers.addEnvVars) {
          console.log("");
          await envData();
        }
        break;
      case "database info":
        const dbArr = ["", "", ""];
        const dbInfo = await fn.dbInfo();
        dbArr[0] = `DB_NAME: '${dbInfo.dbName}'`;
        dbArr[1] = `DB_USERNAME: '${dbInfo.dbUsername}'`;
        dbArr[2] = `DB_PASSWORD: '${dbInfo.dbPassword}'`;
        dbArr.forEach((index) => envVars.push(index));
        if (dbInfo.addEnvVars) {
          console.log("");
          await envData();
        }
        break;
      case "API key":
        const apikey = await fn.apiKey();
        const apikeyEnvVar = `API_KEY: '${apikey.apiKey}'`;
        envVars.push(apikeyEnvVar);
        if (apikey.addEnvVars) {
          console.log("");
          await envData();
        }
        break;
    }
    fn.fileWriter(".env", envVars);
  };
  envData();
};

//TODO:
const mdMenu = () => {};

mainMenu();
