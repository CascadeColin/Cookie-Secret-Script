module.exports = {
/* SECTION 1: .env variables  */
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
      // must be true in order to show user # of chars they've inputted
      mask: true
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
/* SECTION 2: choosing a filepath  */
  filePath: [
    {
      type: "list",
      name: "specifyPath",
      message: "Save to current directory or a different one?",
      choices: ["Choose a filepath", "Use current directory"],
    },
    {
      type: "input",
      name: "newPath",
      message: "Specify the desired path:",
      when: answer => !answer.specifyPath 
    }
  ]
};
