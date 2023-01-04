class VramUsageLineChart extends LineChart{
    constructor(containerId, isLiveStreaming){
        super(containerId, isLiveStreaming);

        this.layout.title = "VRAM Usage";
        this.layout.yaxis = { title: "Amount of VRAM Used in Gb" };
    }
    async push(monitor){
        let timeString = monitor.time;

        let VRAMusage = Number((monitor.VRAMusage / Math.pow(1024,3)).toFixed(2));
        this.dataToUpdate.y[0].push(VRAMusage);
        this.dataToUpdate.x[0].push(timeString);

        this.dataGraph[0].x.push(timeString);
        this.dataGraph[0].y.push(VRAMusage);

        this.update();

    }
    async initialyze(monitors){
        let r = [
            {
                VRAMusage: [], 
                time: []
            }
        ]
        monitors.forEach(element => {
            r[0].VRAMusage.push(Number((element.VRAMusage / Math.pow(1024,3)).toFixed(2)))
            r[0].time.push(element.time)
        });
        super.initialyze(r, "VRAMusage");
    }
}