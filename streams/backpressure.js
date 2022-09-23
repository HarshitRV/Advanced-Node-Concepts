const fs = require("fs");
const path = require("path")
const readFilePath = path.join(__dirname, "files", "video.mp4");
const copyToPath = path.join(__dirname, "files", "copy_video.mp4");

const readStream = fs.createReadStream(readFilePath, {
    // highWaterMark : 1232324  // this is to set the size of our hose.
});

const writeStream = fs.createWriteStream(copyToPath);

readStream.on("data", chunk => {
    const result = writeStream.write(chunk);
    if(!result) {
        console.log("there is backpressure, pausing the stream");
        readStream.pause();
    }
});

writeStream.on("drain", ()=>{
    console.log("pipe is drained...");
    readStream.resume();
    console.log("resuming the stream...")
});

readStream.on("error", err => {
    console.log("An error occured...");
    console.error(err);
});

readStream.on("end", ()=>{
    console.log("readstream finished...");
    writeStream.end();
})

writeStream.on("close", ()=>{
    process.stdout.write("write stream ended file copied...")
})