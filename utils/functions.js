const { writeFile, write, createWriteStream, end } = require("fs");
const { webcrypto } = require("node:crypto");
const { subtle } = webcrypto;
const inquirer = require("inquirer");
const questions = require("../utils/questions");

module.exports = {
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
      throw new Error("Hash generation failed.")
    }
    return keygen.k;
  },
  envType: async function () {
    const a = await inquirer.prompt(questions.envType);
    return a;
  },
  menu: async function () {
    const a = await inquirer.prompt(questions.mainMenu);
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
  }
};
