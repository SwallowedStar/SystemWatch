class CpuTemperatureLineChart extends Display{
    constructor(containerId, computerCores, existingData){
        super(containerId);
        this.receivedCoreStatus = [];
        this.computerCores = computerCores;

        // We initialise the data
        const data = {
            x:[],
            y:[],
            mode: 'lines+markers'
        }
        for(let i = 0; i < MAX_AMOUNT_LINE_DATA_DISPLAYED * this.computerCores.length; i+=this.computerCores.length){
            let corestatus = existingData[i]
            if(corestatus !== undefined){
                let time = new Date(corestatus.time);
                let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;

                let corestatuses = existingData.slice(i, i + 4)
                let onTime = true
                let cpuTemperature = 0

                corestatuses.forEach((e)=>{
                    onTime = onTime && (corestatuses[0].time == e.time);
                    cpuTemperature += e.coreTemp / this.computerCores.length
                })

                if(corestatuses.length == this.computerCores.length && onTime){
                    data.x.push(timeString)
                    data.y.push(cpuTemperature)
                }
            } else {
                data.x.unshift(0)
                data.y.unshift(0)
            }
        }

        const layout = {
            title: "CPU Temperature in Celsius over time",
            xaxis: {
                title: "Time",
                rangemode: 'tozero',
                range : [0, MAX_AMOUNT_LINE_DATA_DISPLAYED]
            },
            yaxis: {
                title: "CPU Temperature in Celsius",
                range: [0,100]
            }
        }
        Plotly.newPlot(this.graphId, [data], layout);
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

            this.receivedCoreStatus = [];

            this.update();
        }
    }
    update(){
        Plotly.extendTraces(this.graphId, this.dataToUpdate, [0]);
        super.update()
    }
}