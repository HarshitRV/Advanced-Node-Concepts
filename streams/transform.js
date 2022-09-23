const { Transform } = require("stream")

class ReplaceText extends Transform {
    constructor(char) {
        super();
        this.replaceChar = char;
    }

    _transform (chunk, encoding, callback) {
        const transfomedString = chunk.toString().replace(/[a-z]|[A-Z]|[0-9]/g, this.replaceChar);
        this.push(transfomedString);
        callback()
    }

    // once our readStream has stopped we can push more data on our
    // transform stream
    _flush (callback) {
        this.push("This is more data...");
        callback()
    }
}

const replaceText = new ReplaceText("X")

process.stdin.pipe(replaceText).pipe(process.stdout);