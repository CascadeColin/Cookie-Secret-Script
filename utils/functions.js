const { writeFile, write, createWriteStream, end } = require("fs");
const { webcrypto } = require("node:crypto");
const { subtle } = webcrypto;
const inquirer = require("inquirer");
const questions = require("../utils/questions");
const prompts = require("../utils/prompts")

module.exports = {
  // TODO: warn user that file will be overwritten
  fileWriter: function (file, data) {
    if (Array.isArray(data)) {
      const writer = createWriteStream(file);
      writer.once("open", (fd) => {
        data.forEach((variable) => {
          writer.write(`${variable}\n`);
        });
        writer.end();
      });
    } else {
      throw new Error("Invalid data type");
    }
  },
  keyGenerator: async function () {
    const hash = await subtle.generateKey(
      {
        name: "HMAC",
        hash: "SHA-512",
        length: 512,
      },
      true,
      ["sign", "verify"]
    );
    const keygen = await subtle.exportKey("jwk", hash);
    if (!keygen.k) {
      throw new Error("Hash generation failed.");
    }
    return keygen.k;
  },
  envType: async function () {
    const a = await inquirer.prompt(prompts.envMenu);
    return a;
  },
  menu: async function () {
    const a = await inquirer.prompt(prompts.mainMenu);
    return a;
  },
  apiKey: async function () {
    const a = await inquirer.prompt(questions.apiKey);
    return a;
  },
  sessionSecret: async function () {
    const a = await inquirer.prompt(questions.sessionSecret);
    return a;
  },
  dbInfo: async function () {
    const a = await inquirer.prompt(questions.dbInfo);
    return a;
  },
  filePath: async function () {
    const a = await inquirer.prompt(questions.filePath);
    return a;
  },
  dbObjSorter: async function () {
    const dbArr = [];
    const dbInfo = await this.dbInfo();
    dbArr[0] = `DB_NAME: '${dbInfo.dbName}'`;
    dbArr[1] = `DB_USERNAME: '${dbInfo.dbUsername}'`;
    dbArr[2] = `DB_PASSWORD: '${dbInfo.dbPassword}'`;
    return {
      dbArr: dbArr,
      addEnvVars: dbInfo.addEnvVars,
    };
  },
  pathBooleanConverter: function (obj) {
    if (obj.specifyPath === "Choose a filepath") {
      obj.specifyPath = true;
    } else if (obj.specifyPath === "Use current directory") {
      obj.specifyPath = false;
    } else {
      throw new Error(
        "Object.specifyPath not recognized.  Check questions.filePath to begin debugging."
      );
    }
    return obj;
  },
  // TODO: goal is to allow this to hold the entire "C:\" directory 
  _dir: async function () {
    
  }
};
