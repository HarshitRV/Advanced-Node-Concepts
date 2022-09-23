// Resolving with no response
const delay = seconds => new Promise((resolves, rejects)=>{
    setTimeout(resolves, seconds * 1000);
})

// Resolving with a response
const anotherDelay = seconds => new Promise((resolves, rejects)=>{
    setTimeout(()=>{
        resolves(`Delay of ${seconds} seconds ended...`)
    }, seconds * 1000)
});

// Calling delay and waiting for it to resolve
delay(2)
    .then(()=>{
        console.log("Logged after 2 seconds...")
    });

// Calling another delay and waiting for response
anotherDelay(2)
    .then((res)=>{
        console.log(`Logged with a response: ${res}`)
    });


// Using a asynchronous function, better than .then chaining
const asyncFun = async () => {
    const res = await anotherDelay(3);
    console.log(res);
}
asyncFun();

// This should not be blocked by code running above
console.log("This should be logged first...")