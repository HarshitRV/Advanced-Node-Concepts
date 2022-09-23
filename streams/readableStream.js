const { Readable } = require("stream");

const array = [
    "Tesla",
    "Microsoft",
    "Apple",
    "Bun",
    "Tata"
];

class StreamFromArray extends Readable {
    constructor(array = []){
        // Creating readable with endcoding utf-8 to read string.
        // super({ encoding: "utf-8" })

        // Creating readable with encoding option { objectMode: true }
        super( { objectMode: true });
        this.array = array;
        this.index = 0;
    }

    _read () {
        if(this.index <= this.array.length) {
            // Regular chunk of data.
            // const chunk = this.array[this.index];

            // Object mode chunk
            const chunk = {
                data: this.array[this.index],
                index: this.index
            }
            this.push(chunk);
            this.index += 1;
        } else {
            this.push(null);
        }
    }
}

const streamFromArray = new StreamFromArray(array);

streamFromArray.on("data", data => {
    // If we are reading binary we can covert to text using toString
    // console.log(data.toString().trim());

    // Read the data in default encoding type as set in super()
    console.log(data)
})

streamFromArray.on("end", ()=>{
    console.log("finished reading from the stream");
})