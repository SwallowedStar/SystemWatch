class CpuUsageLineChart extends LineChart{
    constructor(containerId, computerCores){
        super(containerId)
        this.computerCores = computerCores
        this.receivedCoreStatus = []

        this.layout.title = "CPU Usage in % over time",
        this.layout.yaxis = {
            title: "CPU Usage in %",
            range: [0,100]
        }
        Plotly.newPlot(this.graphId, JSON.parse(JSON.stringify(this.dataGraph)), this.layout);
    }
    async push(corestatus){
        let justOnTime = true;
        this.receivedCoreStatus.push(corestatus);
        if(this.receivedCoreStatus[0].idCore != this.computerCores[0].idCore){
            justOnTime = false;
            this.receivedCoreStatus = [];
        }

        if(justOnTime && this.receivedCoreStatus.length == this.computerCores.length){
            let averageUsage = 0;
            for(let cs of this.receivedCoreStatus){
                averageUsage += cs.coreUsage / computer.CPU.coreNumber;
            }
            let time = new Date(this.receivedCoreStatus[0].time);
            let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;
            
            this.dataToUpdate.x[0].push(timeString);
            this.dataToUpdate.y[0].push(averageUsage);
            
            this.dataGraph[0].x.push(timeString)
            this.dataGraph[0].y.push(averageUsage)

            this.receivedCoreStatus = [];

            this.update();
        }
    }
}