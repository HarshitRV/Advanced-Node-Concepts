const express = require("express");
const fs = require("fs");
const path = require("path")
const file = path.join(__dirname, "files", "video.mp4");
const { promisify } = require("util");
const fileStat = promisify(fs.stat);
const morgan = require("morgan");
const multiparty= require("multiparty")

const app = express();

app.use(morgan("dev"))

app.route("/").get((req, res) => {
    res.status(200).send({
        goodStream: "http:/localhost:3000/good",
        badStream: "http:/localhost:3000/bad"
    })
})

app.route("/upload")
    .get((req, res) => {
        return res.send(`
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="uploadFile" required/>
            <button>Upload</button>
        </form>`
        )
    })
    .post((req, res) => {
        // req.pipe(res);
        // req.pipe(process.stdout);
        if (!fs.existsSync(path.join(__dirname, "uploads"))) {
            fs.mkdirSync(path.join(__dirname, "uploads"));
        }
        req.pipe(fs.createWriteStream(path.join(__dirname, "uploads", "file.txt"))).on("close", () => {
            console.log("finish uploading")
            res.status(200).send("File upload success");
        })
    })

app.route("/uploadwithmultiparty")
    .get((req, res) => {
        return res.send(`
    <form action="/uploadwithmultiparty" method="POST" enctype="multipart/form-data">
        <input type="file" name="uploadFile" required/>
        <button>Upload</button>
    </form>`
        )
    })
    .post((req, res)=>{
        const form = new multiparty.Form();
        form.on("part", (part) => {
            console.log(
                `
                    ${Object.getOwnPropertyNames(part)}

                `
            )
            if(!fs.existsSync(path.join(__dirname, "uploads"))) {
                fs.mkdirSync(path.join(__dirname, "uploads"));
            }
            part
                .pipe(fs.createWriteStream(path.join(__dirname, "uploads", `${part.filename}`)))
                .on("close", ()=>{
                    res.status(200).send(`${part.filename} uploaded successfully`);
                });
        })
        form.parse(req);
    });

app.route("/bad").get(async (req, res) => {
    const { size } = await fileStat(file);
    const range = req.headers.range;
    if (range) {
        let [start, end] = range.replace(/bytes=/, "").split("-");
        start = parseInt(start, 10);
        end = end ? parseInt(end, 10) : size - 1;

        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": (end - start) + 1,
            "Content-Type": 'video/mp4'
        })
        // Bad for perfomance as we are streaming the eniter buffer at once
        fs.readFile(file, (error, data) => {
            if (error) console.log(`Error ${error.message}`);
            res.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': size }).end(data);
        })
    } else {
        // Bad for perfomance as we are streaming the eniter buffer at once
        fs.readFile(file, (error, data) => {
            if (error) console.log(`Error ${error.message}`)
            res.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': size }).end(data)
        });
    }
});


app.route("/good").get(async (req, res) => {
    const { size } = await fileStat(file);
    const range = req.headers.range;
    if (range) {
        let [start, end] = range.replace(/bytes=/, "").split("-");
        start = parseInt(start, 10);
        end = end ? parseInt(end, 10) : size - 1;
        console.log(`Start: ${start}, End: ${end}`)


        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": (end - start) + 1,
            "Content-Type": 'video/mp4'
        })
        // Instead send buffer by buffer not all at once
        fs.createReadStream(file, { start, end }).pipe(res);
    } else {
        res.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': size })
        // Instead send buffer by buffer not all at once
        fs.createReadStream(file)
            .pipe(res)
            .on("error", console.error)
    }
});

app.listen(3000, () => {
    console.log("Server live on http://localhost:3000");
});