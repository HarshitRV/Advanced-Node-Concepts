const {
    Duplex,
    PassThrough
} = require("stream");
const {
   createReadStream,
   createWriteStream 
} = require("fs")
const path = require("path");

class Throttle extends Duplex {
    constructor(ms = 10){
        super();
        this.delay = ms;
        this.start = new Date();
    }
    _read () { }

    _write (chunk, encoding, callback) {
        // Push the chunk of data.
        this.push(chunk) 

        // then call the callback to let the stream know
        // that this call has been completed 
        // * Here I am delaying the callback to throttle down the speed
        setTimeout(callback, this.delay)
    }

    _final () {
        // push null to let it know that the write has been completed
        this.push(null)
        console.log(`Write operation took ${(new Date() - this.start) / 1000} seconds`);
    }
}

const fileToRead = path.join(__dirname, "files", "video.mp4");
const writeTo = path.join(__dirname, "files", "copy.mp4");

const readStream = createReadStream(fileToRead);
const writeStream = createWriteStream(writeTo);

const report = new PassThrough();
const throttle = new Throttle();

let total = 0;
let pass = 0;
report.on("data", chunk => {
    total += chunk.length;
    pass++;
    console.log(`
    
    **********************************************
        Reading chuck of size: ${chunk.length}
        Pass: ${pass}
        Total of bytes pass through ${total} bytes;
    **********************************************

    `);
})

readStream
    .pipe(report)
    .pipe(throttle)
    .pipe(writeStream)