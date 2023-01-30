module.exports = {
  mainMenu: [
    {
      type: "list",
      name: "filetype",
      message: "Where would you like to begin?",
      choices: ["create a .env file", "create a .md file (in development)", "create a MVC directory (in development)"],
    },
  ],
  md: [
    // TODO: inquirer questions
  ],
  envType: [
    {
      type: "list",
      name: "envtype",
      message: "What type of environmental variable?",
      choices: ["session secret", "database info", "API key"],
    },
  ],
  sessionSecret: [
    {
      type: "input",
      name: "secretName",
      message: "What is the name of the variable?",
      default: "SECRET",
    },
    {
      type: "confirm",
      name: "useKeyGen",
      message: "Would you like a random string made for you? (SHA-512 hash)",
    },
    {
      type: "input",
      name: "secretStr",
      message: "Enter your session secret: ",
      when: (answer) => !answer.useKeyGen,
    },
    {
      type: "confirm",
      name: "addEnvVars",
      message: "Would you like to create more variables?",
    },
  ],
  dbInfo: [
    {
      type: "input",
      name: "dbName",
      message: "What is the database name?",
    },
    {
      type: "input",
      name: "dbUsername",
      message: "What is the database username?",
    },
    {
      type: "password",
      name: "dbPassword",
      message: "What is the database password?",
    },
    {
      type: "confirm",
      name: "addEnvVars",
      message: "Would you like to create more variables?",
    },
  ],
  apiKey: [
    {
      type: "input",
      name: "apiKey",
      message: "Enter your API key:",
    },
    {
      type: "confirm",
      name: "addEnvVars",
      message: "Would you like to create more variables?",
    },
  ],
  envName: [
    {
      type: "input",
      name: "varname",
      message: "What is the name of your environmental variable?",
    },
  ],
};
