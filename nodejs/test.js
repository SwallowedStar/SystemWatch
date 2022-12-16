const {testMonitorController, testComputerController, testCPUController, testCoreStatusController, testCoreController, purgeTestData, createTestData} = require("./tests")

createTestData()
.then(_=>{
    try{
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
                            console.log(r1)
                            console.log(r2)
                            console.log(r3)
                            console.log(r4)
                            console.log(r5)
                            purgeTestData()
                        })
                    })
                    
                })  
            })
        })
    } catch (error){
        purgeTestData() 
    }
    
})
