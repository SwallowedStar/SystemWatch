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

        Plotly.newPlot(this.graphId, JSON.parse(JSON.stringify(this.dataGraph)), this.layout);
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
            let time = new Date(this.receivedCoreStatus[0].time);
            let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;
            
            this.dataToUpdate.x[0].push(timeString);
            this.dataToUpdate.y[0].push(averageTemp);

            this.dataGraph[0].x.push(timeString)
            this.dataGraph[0].y.push(averageTemp)

            this.receivedCoreStatus = [];

            this.update();
        }
    }
}