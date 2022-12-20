class CpuUsageLineChart extends Display{
    constructor(containerId, computerCores){
        super(containerId)
        this.computerCores = computerCores
        this.receivedCoreStatus = []

        this.data = [{
            x: [],
            y: [],
            mode: 'lines+markers'
        }]
        this.layout = {
            title: "CPU Usage in % over time",
            editable: true,
            dragmode: 'swap',
            width: 600,
            xaxis: {
                title: "Time",
                rangemode: 'tozero',
                range : this.range
            },
            yaxis: {
                title: "CPU Usage in %",
                range: [0,100]
            }
        }
        Plotly.newPlot(this.graphId, this.data, this.layout);
    }
    async push(monitor){
        let justOnTime = true;
        this.receivedCoreStatus.push(monitor);
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
            
            this.data[0].x.push(timeString)
            this.data[0].y.push(averageUsage)

            this.receivedCoreStatus = [];

            this.update();
        }
    }
}