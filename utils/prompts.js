module.exports = {
  mainMenu: [
    {
      type: "list",
      name: "filetype",
      message: "Where would you like to begin?",
      choices: ["Create .env file", "Create .md file (in development)", "Create MVC directory (in development)", "Quit"],
    },
  ],
  envMenu: [
    {
      type: "list",
      name: "envtype",
      message: "What type of environmental variable?",
      choices: ["Express-Session secret", "Database info", "API key"],
    },
  ],
  mdMenu: [
    // TODO: prompt for creating README
    {},
  ],
  mvcMenu: [
    // TODO: prompt for creating MVC directory
    {},
  ]
};
