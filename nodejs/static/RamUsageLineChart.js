class RamUsageLineChart extends Display{
    constructor(containerId, maxRamAmount, existingData){
        super(containerId)
        this.maxRamAmount = Number((maxRamAmount / Math.pow(1024,3)).toFixed(2))

        const data = {
            x:[],
            y:[],
            mode: 'lines+markers'
        }
        for(let i = 0; i < MAX_AMOUNT_LINE_DATA_DISPLAYED; i ++){
            let monitor = existingData[i]
            if(monitor !== undefined){
                let time = new Date(monitor.time);
                let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;

                let ramUsed = Number((monitor.RAMusage / Math.pow(1024,3)).toFixed(2))
                data.x.push(timeString)
                data.y.push(ramUsed)
            } else {
                data.x.unshift(0)
                data.y.unshift(0)
            }
        }
        const layout = {
            title: "Amount of RAM used",
            xaxis: {
                title: "Time",
                rangemode: 'tozero',
                range : [0, MAX_AMOUNT_LINE_DATA_DISPLAYED]
            },
            yaxis: {
                title: "Amount of RAM Used",
                range: [0,Number((maxRamAmount / Math.pow(1024,3)).toFixed(2))]
            }
        }

        Plotly.newPlot(this.graphId, [data], layout)
    }

    async push(monitor){
        let time = new Date(monitor.time);
        let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;

        let ramUsed = Number((monitor.RAMusage / Math.pow(1024,3)).toFixed(2));
        this.dataToUpdate.y[0].push(ramUsed);
        this.dataToUpdate.x[0].push(timeString);

        this.container.querySelector("#usedRAM").innerHTML = `${Number(ramUsed.toFixed(2))} Gb (${Number((ramUsed/(this.maxRamAmount)*100).toFixed(2))}%)`
        this.container.querySelector("#availableRAM").innerHTML = `${ Number((this.maxRamAmount - ramUsed).toFixed(2)) } Gb`;
        
        this.update();
    }
    update(){
        Plotly.extendTraces(this.graphId, this.dataToUpdate, [0]);
        super.update()
    }

}