module.exports = {
  mainMenu: [
    {
      type: "list",
      name: "filetype",
      message: "What type of file are you making?",
      choices: [".env", ".md"],
    },
  ],
  md: [
    // TODO: inquirer questions
  ],
  envType: [
    {
        type: 'list',
        name: 'envtype',
        message: 'What type of environmental variable is this?',
        choices: ['session secret', 'database info', 'API key']
    }
  ],
  sessionSecret: [
    {
        type: 'input',
        name: 'secretName',
        message: "What is the name of the variable?",
        default: 'SECRET'
    },
    {
        type: 'confirm',
        name: 'useKeyGen',
        message: "Would you like a random string made for you? (SHA-512 hash)"
    },
    {
        type: 'input',
        name: 'secretStr',
        message: "Enter your session secret: ",
        when: (answer => !answer.useKeyGen)
    }
  ],
  dbInfo: [],
  apiKey: [],
  envName: [
    {
        type: 'input',
        name: 'varname',
        message: "What is the name of your environmental variable?",
    },
  ],
  addAnotherEnv: [
    {
        type: 'confirm',
        name: 'addEnvVars',
        message: 'Would you like to create more variables?'
    }
  ]
};
