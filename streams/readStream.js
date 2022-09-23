const fs = require("fs");
const path = require("path")

const readStream = fs.createReadStream(path.join(__dirname, "files", "video.mp4"))

readStream.on("data", (data)=>{
    console.log("Reading chunk\n", data);
    console.log(`Chunk size: ${data.length}`);
});

readStream.on("end", ()=>{
    console.log("Finish reading the data stream.");
    process.exit()
});

readStream.on("error", (error)=>{
    console.log("An error ocurred while reading the stream");
    console.error(error);
})

readStream.pause();

process.stdin.on("data", (data)=>{
    console.log(`echo: ${data}`);
    if(data.toString().trim() === "exit"){
        process.exit();
    }
    if(data.toString().trim() === "readStream") {
        readStream.resume();
    }
    if(data.toString().trim() === "read") {
        readStream.read();
    }
})

