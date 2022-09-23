const delay = (seconds) => new Promise((resolves, rejects) => {
    setTimeout(resolves, seconds * 1000);
});

const logValue = async (value) => {
    process.stdout.clearLine(10)
    process.stdout.cursorTo(0);
    process.stdout.write(`Loggin value: ${value}`);
}

process.stdin.on("data", data => {
    console.log(data.toString().trim());
})

const main = async() => {
    let i = 0
    while (i < 10) {
        logValue(i)
        await delay(0.5)
        i++;
    }
}
main()