require("dotenv").config();
const inquirer = require("inquirer");
const questions = require("./utils/questions")
const prompts = require("./utils/prompts")
const { ASCII } = require("./utils/title");
const fn = require("./utils/functions");

/* This script exists to be the settings/setup for the main app. */

/* Planned features:
1) Set a default PATH.  This defines where in the user's file system the app can search for a directory to save their files to.
    - see fs.inquirer.js for funcionality
2) Set custom default answers for specified questions
    - example: When making express-session secrets for .env files, default to variable name "SECRET", but allow the user to specify anything they want
3) Allow for the creation of custom directory paradigms.  MVC will be built in, but allow users to create their own.
4) More ideas as they are thought up...
*/

const setup = async () => {

}