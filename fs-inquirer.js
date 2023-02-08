const inquirer = require("inquirer");
const fuzzy = require("fuzzy");
const inquirerPrompt = require("inquirer-autocomplete-prompt");
const path = require("path");
const { readdir } = require("fs/promises");
const fs = require("fs");

inquirer.registerPrompt("autocomplete", inquirerPrompt);

// load in user settings as a global variable
// TODO: consider using MongoDB to store this as practice
const loadSettings = async () => {
  const settings = await JSON.parse(
    fs.readFileSync("settings.json", { encoding: "utf8" })
  );
  // format raw filenames into a string that can be used to create a RegExp obj
  const fileNames = settings.excluded_directories
    .map((word) => {
      const symbolSearch = word.split("");
      word = symbolSearch
        .map((letter) => {
          if (letter.match(/[.\\*+]/)) {
            letter = `\\${letter}`;
          }
          return letter;
        })
        .join("");
      return `${word}`;
    }).join("|")
  settings.excluded_directories_regex = new RegExp(`(${fileNames})`, "gi");
  return settings;
};

// store user directories in userfs.json based upon user's default path (settings.default_directory)
const init = async () => {
  const settings = await loadSettings()
  const parent = await createParentObj(settings.default_directory);
  // with created parent, recursively create all children
  for (const childObj of parent.children) {
    childObj.children = await getChildDirs(childObj.dirname);
  }
  await fs.writeFile("userfs.json", JSON.stringify(parent), (err) => {
    if (err) throw err;
  });
  return settings;
};

// creates the 'autocomplete' prompt to use the saved file directories in userfs.json

/******************
dirObj needs to be formatted as below:
{
  dirname: STRING representing filepath (PATH),
  children: ARRAY representing dirname's child dirnames
} 
******************/
const createParentObj = async (dir) => {
  return {
    dirname: dir,
    children: await dirObjSetup(dir),
  };
};

// accepts parameters: STRING.
// gets raw Dirent objects, filters out Dirent objects that are not a directory ([Symbol(type)]: 2), maps the Dirent objects and sets up the child object in the same format.  Lastly, runs the array through dirFilter() to remove specified unwanted directories (such as node_modules)
// RETURNS an array
const dirObjSetup = async (dir) => {
  const arr = (await readdir(dir, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map(
      (dirent) => (dirent = { dirname: `${dir}\\${dirent.name}`, children: [] })
    );
  return arr;
};

// accepts parameters: STRING.
// passes paramater through dirObjSetup() to convert the splitStr PATH into a dirObj object
// for each object in dirObj.children array, recursively create more children until there are no remaining dirname strings
// RETURNS an object
const getChildDirs = async (dir) => {
  const settings = await loadSettings()
  if (dir) {
    const dirObj = await dirObjSetup(dir);
    for (const obj of dirObj) {
      if (!obj.dirname.match(settings.excluded_directories_regex)) {
        obj.children = await getChildDirs(obj.dirname);
      }
    }
    return dirObj;
  }
};

init()




/**** STEP 2: incorporate arrays into inquirer-autocomplete with fuzzy ****/

// const users = [ 'colin', 'Default', 'Public' ]
//
// inquirer
//   .prompt([
//     {
//       type: "autocomplete",
//       name: "dir",
//       message: "What directory are you looking for?",
//       sugguestOnly: true,
//       emptyText: "No directory found!",
//       pageSize: 4,
//       source: searchDirs,
//       default: "C:\\users\\",
//       // validates that user input is defined, else display string
//       validate(val) {
//         return val ? true : "Begin typing to search!";
//       },
//     },
//   ])
//   .then((answers) => console.log(JSON.stringify(answers, null, 2)));
