class RamUsageLineChart extends LineChart{
    constructor(containerId, maxRamAmount, isLiveStreaming){
        super(containerId, isLiveStreaming)
        this.maxRamAmount = Number((maxRamAmount / Math.pow(1024,3)).toFixed(2))

        this.layout.title = "Amount of RAM used";
        this.layout.yaxis = {
            title: "Amount of RAM Used",
            range: [0,Number((maxRamAmount / Math.pow(1024,3)).toFixed(2))]
        }

        //Plotly.newPlot(this.graphId, JSON.parse(JSON.stringify(this.dataGraph)), this.layout)
    }

    async push(monitor){
        let timeString = monitor.time;

        let ramUsed = Number((monitor.RAMusage / Math.pow(1024,3)).toFixed(2));
        this.dataToUpdate.y[0].push(ramUsed);
        this.dataToUpdate.x[0].push(timeString);

        this.dataGraph[0].x.push(timeString);
        this.dataGraph[0].y.push(ramUsed);

        this.container.querySelector("#usedRAM").innerHTML = `${Number(ramUsed.toFixed(2))} Gb (${Number((ramUsed/(this.maxRamAmount)*100).toFixed(2))}%)`
        this.container.querySelector("#availableRAM").innerHTML = `${ Number((this.maxRamAmount - ramUsed).toFixed(2)) } Gb`;
        
        this.update();
    }

    async initialyze(monitors){
        let r = [
            {
                RAMusage: [], 
                time: []
            }
        ]
        monitors.forEach(element => {
            r[0].RAMusage.push(Number((element.RAMusage / Math.pow(1024,3)).toFixed(2)))
            r[0].time.push(element.time)
        });
        super.initialyze(r, "RAMusage")
    }
}