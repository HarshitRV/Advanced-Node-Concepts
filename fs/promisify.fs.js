// import { promisify } from "util";
// import fs from "fs"
// ****** path does not support import in node
// import path from "path";
// ******-------------------------------------

const { promisify } = require("util");
const fs = require("fs");
const path = require("path");

// Promisifying the writeFile async function
const writeFile = promisify(fs.writeFile);

writeFile(`${path.join(__dirname, "files", "sample.txt")}`, "This is created with a promise")
    .then(()=>{
        console.log("Write to file success.")
    })
    .catch((err)=>{
        console.log(`Error, ${err.message}`);
    })

console.log(path.join(__dirname))