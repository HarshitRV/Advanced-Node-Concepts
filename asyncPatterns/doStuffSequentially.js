const { promisify } = require("util");
const path = require("path")
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const delay = (seconds) => new Promise((resolves, rejects)=>{
    setTimeout(resolves, seconds * 1000)
})

const doStuffSequentially = () => Promise.resolve()
    .then(()=>console.log("starting process..."))
    .then(()=>delay(1))
    .then(()=>"creating file named file.txt")
    .then(console.log)
    .then(()=>delay(3))
    .then(()=>"file created success")
    .then(console.log)
    .then(()=>writeFile(`${path.join(__dirname, "files", "file.txt")}`, "This should be written to the file"))
    .then(()=>"deleting file now...")
    .then(console.log)
    .then(()=>delay(2))
    .then(()=>unlink(`${path.join(__dirname, "files", "file.txt")}`))
    .then(()=>"deleted successfully...")
    .then(console.log);

// doStuffSequentially();

const doStuffAsynFun = async () => {
    console.log("Begin process");
    await delay(1);
    console.log("creating a file named file.txt");
    await delay(3);
    console.log("file created success")
    await writeFile(`${path.join(__dirname, "files", "file.txt")}`, "This should be written to the file");
    console.log("delting file now...");
    await delay(2);
    await unlink(`${path.join(__dirname, "files", "file.txt")}`);
    console.log("delted successfully...")
}
doStuffAsynFun();