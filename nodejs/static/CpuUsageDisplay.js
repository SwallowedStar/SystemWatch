class CpuUsageDisplay extends Display{
    constructor(containerId, computerCores, existingData){
        super(containerId)
        this.computerCores = computerCores
        this.receivedCoreStatus = []

        const data = {
            x: [],
            y: []
        }
        for(let i = 0; i < MAX_AMOUNT_LINE_DATA_DISPLAYED * this.computerCores.length; i += this.computerCores.length){
            let monitor = existingData[i]
            if(monitor !== undefined){
                let time = new Date(monitor.time);
                let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;

                let monitors = existingData.slice(i, i + 4)
                let onTime = true
                let averageUsage = 0

                monitors.forEach((m)=>{
                    onTime = onTime && (monitors[0].time == m.time);
                    averageUsage += m.coreTemp / this.computerCores.length
                })

                if(monitors.length == this.computerCores.length && onTime){
                    data.x.push(timeString)
                    data.y.push(averageUsage)
                }
            } else {
                data.x.unshift(0)
                data.y.unshift(0)
            }

            const layout = {
                title: "CPU Usage in % over time",
                xaxis: {
                    title: "Time",
                    rangemode: 'tozero',
                    range : [0, MAX_AMOUNT_LINE_DATA_DISPLAYED]
                },
                yaxis: {
                    title: "CPU Usage in %",
                    range: [0,100]
                }
            }
            Plotly.newPlot(this.graphId, [data], layout);
        }
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

            this.receivedCoreStatus = [];

            this.update();
        }
    }
    update(){
        Plotly.extendTraces(this.graphId, this.dataToUpdate, [0]);
        super.update()
    }
}