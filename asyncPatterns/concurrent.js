import logUpdate from "log-update";
const logX = () => "X";
const delay = (seconds) => new Promise((resolves, rejects) => {
    setTimeout(() => {
        resolves(`Delay of ${seconds} ended..`)
    }, seconds * 1000);
})

class PromiseQueue {
    constructor(promises = [], concurrentCount = 1) {
        this.concurrent = concurrentCount;
        this.total = promises.length;
        this.todo = promises;
        this.running = [];
        this.complete = [];
    }

    get runAnother() {
        return (this.running.length < this.concurrent) && (this.todo.length || false) && true
    }

    graphTasks() {
        const { todo, running, complete } = this;
        console.log(`
        ***********************************************

            todo: [ ${todo.map(logX)} ]
            running:[ ${running.map(logX)} ]
            complete: [ ${complete.map(logX)} ]

        ***********************************************
        `)
    }

    run() {
        while (this.runAnother) {
            console.log(this.runAnother)
            let promise = this.todo.shift()
            promise.then((message) => {
                console.log(message)
                this.complete.push(this.running.shift());
                this.graphTasks();
                this.run();
            });
            this.running.push(promise);
            this.graphTasks()
        }
    }
}

const tasks = [
    delay(1),
    delay(2),
    delay(3),
    delay(4)
]

const promiseQueue = new PromiseQueue(tasks, 2)
promiseQueue.run()