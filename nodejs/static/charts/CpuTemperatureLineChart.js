class CpuTemperatureLineChart extends LineChart{
    constructor(containerId, computerCores){
        super(containerId);
        this.receivedCoreStatus = [];
        this.computerCores = computerCores;

        this.layout.title = "CPU Temperature in Celsius over time",
        this.layout.yaxis= {
            title: "CPU Temperature in Celsius",
            range: [0,100]
        }

    }
    async push(corestatus){
        this.receivedCoreStatus.push(corestatus);
        
        if(this.receivedCoreStatus[0].idCore != this.computerCores[0].idCore){
            this.receivedCoreStatus = [];
        } else if(this.receivedCoreStatus.length == this.computerCores.length){
            let averageTemp = 0;
            for(let cs of this.receivedCoreStatus){
                averageTemp += cs.coreTemp / computer.CPU.coreNumber;
            }
            let timeString = corestatus.time;

            this.dataToUpdate.x[0].push(timeString);
            this.dataToUpdate.y[0].push(averageTemp);

            this.dataGraph[0].x.push(timeString)
            this.dataGraph[0].y.push(averageTemp)

            this.receivedCoreStatus = [];

            this.update();
        }
    }
    async initialyze(cpuData){
        super.initialyze(cpuData, "temperature")
    }
}