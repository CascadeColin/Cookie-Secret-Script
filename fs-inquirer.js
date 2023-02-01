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
  // console.log(typeof dirname)
  const filterArr = dirname.split("\\");
  for (const dir of filterArr) {
    if (dir.match(/^(node_modules|\.git)$/)) {
      // console.log(`to be removed: ${dir} at index ${filterArr.indexOf(dir)}`)
      filterArr.splice(0);
    }
  }
  dirname = filterArr.join("\\");
  if (dirname) {
    // console.log(typeof dirname);
    return dirname;
  }
};

//FIXME: each directory is being duplicated as a child, with the subchild being an object instead of an array
const dirObjSetup = async (dir) => {
  return {
    dirname: dir,
    // gets raw Dirent objects, filters out Dirent objects that are not a directory ([Symbol(type)]: 2), maps the Dirent objects and sets up the child object in the same format
    children: (await readdir(dir, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map(
        (dirent) =>
          (dirent = { dirname: `${dir}\\${dirent.name}`, children: [] })
      ),
  };
};

const getChildDirs = async (dir) => {
  // console.log('raw: '+typeof dir)
  // currently filtering out ".git" and "node_modules".  to filter more, add them to the regex in dirnameFilter()
  const filteredDir = await dirnameFilter(dir);
  // console.log('filtered: '+typeof filteredDir)
  if (filteredDir) {
    //FIXME: I think the duplication is here
    const parentDir = await dirObjSetup(dir);
    if (parentDir.children.length) {
      for (const child of parentDir.children) {
        child.children = await getChildDirs(child.dirname);
      }
      return parentDir;
    } else {
      return parentDir;
    }
  }
};

// temporary function before running recursion
const executeInOrder = async () => {
  const data = await getChildDirs(`C:\\Users\\colin\\bootcamp`);
  // const data = await getChildDirs(`C:\\Users\\colin\\bootcamp\\Work-Day-Scheduler`);
  // await getChildDirs("C:\\Users\\colin\\bootcamp\\Work-Day-Scheduler\\assets");
  // await getChildDirs(
  //   "C:\\Users\\colin\\bootcamp\\Work-Day-Scheduler\\assets\\js"
  // );
  // console.dir(util.inspect(data, true, null, true))
  await fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log("file created")
  });
};
executeInOrder();

// const init = async () => {
//     const dir = await getChildDirs(`C:\\Users\\colin\\bootcamp`);
//     return dir;
// }
// init();

// // getChildDirs('c:\\users\\colin');

// // const users = [ 'colin', 'Default', 'Public' ]

// const searchDirs = async (answers, input = "") => {
//   const dir = await getChildDirs(`C:\\Users\\colin\\bootcamp`);
//   const result = await fuzzy.filter(input, dir).map(e => e.original)
//   return result;
// };

// searchDirs({}, "")

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
