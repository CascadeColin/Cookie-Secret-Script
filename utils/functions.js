const { writeFile } = require("fs");
const { webcrypto } = require("node:crypto");
const { subtle } = webcrypto;

module.exports = {
  fileWriter: function (file, data) {
    writeFile(file, data, { flag: "wx" }, (err) => {
      if (err) {
        if (err.code === "EEXIST") {
          console.log("\nERROR: file already exists\n");
          return;
        }
      }
      return;
    });
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
  writeEnvFile: function (str) {
    const data = this.formatEnvVars(str);
    this.fileWriter(".env", data);
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
