const inquirer = require("inquirer");
const fuzzy = require("fuzzy");
const inquirerPrompt = require("inquirer-autocomplete-prompt");
const path = require("path");
const { readdir } = require("fs/promises");
const fs = require("fs");

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
      return `(${word})`;
    })
    .join("*")
    .concat("", "*");

  settings.excluded_directories_regex = new RegExp(fileNames, "gi");
  return settings;
};


// store user directories in userfs.json based upon user's default path (settings.default_directory)
const init = async () => {
  const settings = await loadSettings(); 
  console.log(settings)
  const parent = await createParentObj(settings.default_directory);
  // with created parent, recursively create all children
  for (const childObj of parent.children) {
    childObj.children = await getChildDirs(childObj.dirname);
  }
  await fs.writeFile("userfs.json", JSON.stringify(parent), (err) => {
    if (err) throw err;
  });
};

// creates the 'autocomplete' prompt to use the saved file directories in userfs.json
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
  dirFilter(dir, arr);
  return arr;
};

/* directory filtering */
// if dirObj is not empty, loop through each object.  Split dirObj.dirname by \\ (returns array).  If the last index in Split array === banned keyword, splice the array at Split.length-1 to get rid of it.  Then, join the array back into a string and assign it to dirObj.dirname
const dirFilter = (str, arr) => {
  if (arr.length !== 0) {
    for (const obj of arr) {
      const splitStr = obj.dirname.split("\\");
      if (splitStr[splitStr.length - 1].match(/(node_modules|\.git)/)) {
        splitStr.splice(splitStr.length - 1);
      }
      obj.dirname = splitStr.join("\\");
      if (obj.dirname === str) {
        arr.splice(arr.indexOf(obj), 1);
      }
    }
  }
  return arr;
};

// accepts parameters: STRING.
// passes paramater through dirObjSetup() to convert the splitStr PATH into a dirObj object
// for each object in dirObj.children array, recursively create more children until there are no remaining dirname strings
// RETURNS an object
const getChildDirs = async (dir) => {
  if (dir) {
    const dirObj = await dirObjSetup(dir);
    for (const obj of dirObj) {
      if (obj.dirname) {
        obj.children = await getChildDirs(obj.dirname);
      }
    }
    return dirObj;
  }
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
