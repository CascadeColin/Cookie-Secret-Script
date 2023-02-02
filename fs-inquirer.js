const inquirer = require("inquirer");
const fuzzy = require("fuzzy");
const inquirerPrompt = require("inquirer-autocomplete-prompt");
const path = require("path");
const { readdir } = require("fs/promises");
const fs = require("fs");

//TODO: filter out specific folders (ie 'node_modules', '.git')

// creates the 'autocomplete' prompt
inquirer.registerPrompt("autocomplete", inquirerPrompt);

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
    // gets raw Dirent objects, filters out Dirent objects that are not a directory ([Symbol(type)]: 2), maps the Dirent objects and sets up the child object in the same format
    children: (await readdir(dir, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map(
        (dirent) =>
          //example: { dirname: `C:\users\bootcamp`, chilren: [] }
          (dirent = { dirname: `${dir}\\${dirent.name}`, children: [] })
      ),
  };
};

// accepts parameters: STRING.
// I don't actually know why this works yet
// RETURNS an array
const dirObjSetup = async (dir) => {
  const subDirs = (await readdir(dir, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map(
      (dirent) => (dirent = { dirname: `${dir}\\${dirent.name}`, children: [] })
    );
  return subDirs;
};

// accepts parameters: STRING.
// passes paramater through dirObjSetup() to convert the stringified PATH into a dirObj object
// for each object in dirObj.children array, recursively create more children until there are no remaining dirname strings
// RETURNS an object
const getChildDirs = async (dir) => {
  if (dir) {
    const dirObj = await dirObjSetup(dir);
    for (const obj of dirObj) {
      if (obj.dirname) {
        obj.children = await getChildDirs(obj.dirname)
      }
    }
    return dirObj;
  }
};

const init = async () => {
  const parent = await createParentObj(`C:\\Users\\colin\\bootcamp`);
  // with created parent, recursively create all children
  for (const childObj of parent.children) {
    childObj.children = await getChildDirs(childObj.dirname)
  }
  await fs.writeFile("userfs.json", JSON.stringify(parent), (err) => {
    if (err) throw err;
  });
};
init();

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
