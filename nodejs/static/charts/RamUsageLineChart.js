class RamUsageLineChart extends Display{
    constructor(containerId, maxRamAmount){
        super(containerId)
        this.maxRamAmount = Number((maxRamAmount / Math.pow(1024,3)).toFixed(2))

        this.dataGraph = [{
            x:[],
            y:[],
            mode: 'lines+markers'
        }]
        this.layout = {
            title: "Amount of RAM used",
            editable: true,
            dragmode: 'swap',
            xaxis: {
                title: "Time",
                rangemode: 'tozero',
                range : this.range
            },
            yaxis: {
                title: "Amount of RAM Used",
                range: [0,Number((maxRamAmount / Math.pow(1024,3)).toFixed(2))]
            }
        }
        Plotly.newPlot(this.graphId, JSON.parse(JSON.stringify(this.dataGraph)), this.layout)
    }

    async push(monitor){
        let time = new Date(monitor.time);
        let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;

        let ramUsed = Number((monitor.RAMusage / Math.pow(1024,3)).toFixed(2));
        this.dataToUpdate.y[0].push(ramUsed);
        this.dataToUpdate.x[0].push(timeString);

        this.dataGraph[0].x.push(timeString);
        this.dataGraph[0].y.push(ramUsed);

        this.container.querySelector("#usedRAM").innerHTML = `${Number(ramUsed.toFixed(2))} Gb (${Number((ramUsed/(this.maxRamAmount)*100).toFixed(2))}%)`
        this.container.querySelector("#availableRAM").innerHTML = `${ Number((this.maxRamAmount - ramUsed).toFixed(2)) } Gb`;
        
        this.update();
    }
}