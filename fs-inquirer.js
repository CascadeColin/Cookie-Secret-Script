const inquirer = require("inquirer");
const fuzzy = require("fuzzy");
const inquirerPrompt = require("inquirer-autocomplete-prompt");
const path = require("path");
const { readdir } = require("fs/promises");
const util = require("util");
const fs = require("fs");

// creates the 'autocomplete' prompt
inquirer.registerPrompt("autocomplete", inquirerPrompt);

// FIXME: children are being cut out, but the filtered names are still getting saved
const dirnameFilter = (dirname) => {
  let filterArr = dirname.split("\\");
  for (const dir of filterArr) {
    if (dir.match(/^(node_modules|\.git)$/)) {
      // console.log(filterArr.indexOf(dir), dir)
      filterArr.splice(0);
    }
  }
  dirname = filterArr.join("\\");
  if (dirname) {
    return dirname;
  }
};

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

const dirObjSetup = async (dir) => {
  const subDirs = (await readdir(dir, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map(
      (dirent) => (dirent = { dirname: `${dir}\\${dirent.name}`, children: [] })
    );
  return subDirs;
};

// accepts a string.  runs the string through a filter (see dirnameFilter()).  if returned string is truthy, pass it through dirObjSetup().
const getChildDirs = async (dir) => {
  // currently filtering out ".git" and "node_modules".  to filter more, add them to the regex in dirnameFilter()
  const filteredDirStr = await dirnameFilter(dir);
  if (filteredDirStr) {
    //FIXME: I think the duplication is here
    const dirObj = await dirObjSetup(dir);
    for (const obj of dirObj) {
      if (obj.dirname) {
        const filter = dirnameFilter(obj.dirname)
        if (filter) {
          obj.children = await getChildDirs(obj.dirname)
        }
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
  await fs.writeFile("data.json", JSON.stringify(parent), (err) => {
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
