const {testMonitorController, testComputerController, testCPUController, testCoreStatusController, testCoreController} = require("./tests")

testMonitorController()
.then(r1 => {
    testComputerController()
    .then(r2 => {
        testCPUController()
        .then(r3 => {
            testCoreStatusController()
            .then(r4 => {
                testCoreController()
                .then(r5 => {
                    console.log(r5)
                })
                console.log(r4)
            })
            console.log(r3)
        })
        console.log(r2)
    })
    console.log(r1)
})