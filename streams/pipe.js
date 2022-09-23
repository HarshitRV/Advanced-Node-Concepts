const { createWriteStream } = require("fs");
const path = require("path");

const writeTo = path.join(__dirname, "files", "file.txt");


const writeStream = createWriteStream(writeTo);

process.stdin.pipe(writeStream).on("error", console.error);