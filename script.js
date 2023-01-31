require("dotenv").config();
const inquirer = require("inquirer");
const questions = require("./utils/questions")
const prompts = require("./utils/prompts")

/* Development Priorities:
* develop dynamic directory creation and selection
* develop automated path structure using MVC paradigm at specified directory, creating it if it does not exist
*/

const { ASCII } = require("./utils/title");
const fn = require("./utils/functions");

const mainMenu = async () => {
  const answers = await fn.menu();
  switch (answers.filetype) {
    case "Create .md file (in development)":
      console.log("test");
      inDevelopment();
      break;
    case "Create .env file":
      console.log("test");
      envMenu();
      break;
    case "Create MVC directory (in development)":
      // TODO: open MVC dir creation menu
      console.log("test");
      inDevelopment();
      break;
    case "Quit":
      console.log('\x1b[1m%s\x1b[0m', '\nThank you for using Project Setup Manager!')
      break;
  }
  return;
};

//TODO: let user pick a directory
const envMenu = async () => {
  const envVars = [];
  // recursive function that lets the user loop through the env var menu as many times as needed
  const envData = async () => {
    const answers = await fn.envType();
    switch (answers.envtype) {
      case "Express-Session secret":
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
        } else {
          return;
        }
        break;
      case "Database info":
        const dbObj = await fn.dbObjSorter();
        const dbArr = dbObj.dbArr;
        dbArr.forEach((index) => envVars.push(index));
        if (dbObj.addEnvVars) {
          console.log("");
          await envData();
        } else {
          return;
        }
        break;
      case "API key":
        const apikey = await fn.apiKey();
        const apikeyEnvVar = `API_KEY: '${apikey.apiKey}'`;
        envVars.push(apikeyEnvVar);
        if (apikey.addEnvVars) {
          console.log("");
          await envData();
        } else {
          return;
        }
        break;
    }
  };
  await envData();
  console.log(``);
  //TODO: let user pick their own path, if desired
  const a = await fn.filePath();
  const currentOrNewPath = await fn.pathBooleanConverter(a);
  if (currentOrNewPath.specifyPath) {
    console.log("TODO: set up custom filepathing");
    // Do you want to create a new path or use existing one?
    // If existing path, search for that path and write to it
    // if new path, verify that the path does not exist.  then create directory and write file to it
    // BONUS: use inquirer-autocomplete-prompt to set up autocompletion!
  } else {
    fn.fileWriter(".env", envVars);
  }
  return;
};

//TODO: implement markdown functionality (merge readme generator!)
const mdMenu = () => {
  // use AI to write section content for .md files
  // ChatGPT API, or OpenAI Codex if ChatGPT is down
};

//TODO: create a MVC paradigm directory at a specified location
const mvcMenu = () => {};

// temporary function used for making development friendlier
const inDevelopment = () => {
  console.log(
    "This feature is currently in development.  Stay tuned for updates!\n"
  );
  mainMenu();
  return;
};

// renders app logo
ASCII();
mainMenu();

// modeule.exports = mainMenu;
