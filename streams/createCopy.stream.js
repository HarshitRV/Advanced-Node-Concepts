const fs = require("fs");
const path = require("path");
const { promisify } = require("util")
const unlink = promisify(fs.unlink);

const delay = seconds => new Promise((resolves, rejects)=>{
    setTimeout(()=>{
        resolves(`delay of ${seconds} ended...`);
    }, seconds * 1000);
})

const deleteFile = (filePath) => {
    unlink(filePath)
        .then(()=>{
            console.log("deleted the file.")
        })
        .catch((err)=>{
            console.log("An error ocurred while deleting...");
            console.error(err);
        })
} 

const readStream = fs.createReadStream(path.join(__dirname, "files","video.mp4"));
const writeStream = fs.createWriteStream(path.join(__dirname, "files", "copy_video.mp4"));

readStream.pipe(writeStream);

readStream.on("end", ()=>{
    writeStream.end();
})

readStream.on("end", ()=>{
    console.log("Finish copying the files...")
    delay(3)
        .then(msg => {
            console.log(msg);
        })
        .then(()=>{
            deleteFile(path.join(__dirname, "files", "copy_video.mp4"));
        })
})

readStream.on("error", (error)=>{
    console.log("An error ocurred while copying");
    console.error(error);
})