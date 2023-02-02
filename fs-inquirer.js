const inquirer = require("inquirer");
const fuzzy = require("fuzzy");
const inquirerPrompt = require("inquirer-autocomplete-prompt");
const path = require("path");
const { readdir } = require("fs/promises");
const fs = require("fs");

// load in user settings as a global variable
const settings = JSON.parse(
  fs.readFileSync("settings.json", { encoding: "utf8" })
);
// join excluded_directories array by | and wrap it in /()/ to create regex for match() to filter them

// FIXME: str does not apply changes to wordArr
const excludedDirectories = () => {
  const wordArr = settings.excluded_directories;
  for (let str of wordArr) {
    // if (str.match(/([.*\\])/)) {
    const match = str.match(/([.*\\])/);
    if (!match) {
      break;
    }
    const split = match.input.split("");
    split.splice(match.index, 0, "\\");
    str = split.join("");
    console.log(str);

    // console.log(match.index, match.input)
  }
  // }
  console.log(wordArr);
  // const excludedRegex = `/(${settings.excluded_directories.join('|')})/`
  // console.log(excludedRegex)
  //        /(node_modules|\.git)/
};
excludedDirectories();

// store user directories in userfs.json based upon user's default path (settings.default_directory)
const init = async () => {
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

// init();

// fs.readFile("settings.json", { encoding: "utf8" }, (err, data) => {
//   if (err) throw err;
//   fetchSettings(data)
// });

// // fetches settings.json using node-fetch
// const fetchSettings = (data) => {
//   console.log(typeof data)
// };

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
