const { writeFile, write, createWriteStream, end } = require("fs");
const { webcrypto } = require("node:crypto");
const { subtle } = webcrypto;

module.exports = {
  fileWriter: function (file, data) {
    // const writer = createWriteStream('');
    if (typeof data === 'string') {
      writeFile(file, data, { flag: "wx" }, (err) => {
        if (err) {
          if (err.code === "EEXIST") {
            console.log("\nERROR: file already exists\n");
            return;
          }
        }
        return;
      });
    } else if (Array.isArray(data)) {
      console.log(`fileWriter: ${data} is an array`)
    } else {
      throw new Error("Must be a string or array.")
    }
  },
  keyGenerator: async function () {
    const hash = await subtle.generateKey(
      {
        name: "HMAC",
        hash: "SHA-512",
        length: 512,
      },
      true,
      ["sign", "verify"]
    );
    const keygen = await subtle.exportKey("jwk", hash);
    return keygen.k;
  },
  // TODO: make compatible with arrays
  writeEnvFile: function (data) {
    const formattedData = this.formatEnvVars(data);
    if (typeof formattedData === "string") {
      this.fileWriter(".env", formattedData);
    } else if (Array.isArray(formattedData)) {
      // array handling
      this.fileWriter(".env", formattedData);
    }
  },
  // accepts a string or array
  formatEnvVars: function (data) {
    if (typeof data === "string") {
      data = this.formatEnvStr(data);
      return data;
    } else if (Array.isArray(data)) {
      if (typeof data[0] !== "string") {
        throw new Error("Arrays may only contain strings");
      }
      const arr = data.map((str) => this.formatEnvStr(str));
      return arr;
    } else {
      throw new Error("Data must be a string or array.");
    }
  },
  formatEnvStr: function (str) {
    const arr = str.split(":");
    const varName = arr.shift();
    arr.unshift("'");
    arr.push("'");
    str = arr.join("");
    return `${varName}: ${str}`;
  }
};
