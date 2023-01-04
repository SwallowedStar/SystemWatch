class GpuTemperatureLineChart extends LineChart{
    constructor(containerId, isLiveStreaming){
        super(containerId, isLiveStreaming);

        this.layout.title = "GPU temperature";
        this.layout.yaxis = { title: "Degree Celcius" };
    }
    async push(monitor){
        let timeString = monitor.time;

        let GPUtemp = monitor.GPUtemp;
        this.dataToUpdate.y[0].push(GPUtemp);
        this.dataToUpdate.x[0].push(timeString);

        this.dataGraph[0].x.push(timeString);
        this.dataGraph[0].y.push(GPUtemp);

        this.update();
    }
    async initialyze(monitors){
        
        let r = [
            {
                GPUtemp: [], 
                time: []
            }
        ]
        monitors.forEach(element => {
            r[0].GPUtemp.push(Number(element.GPUtemp))
            r[0].time.push(element.time)
        });
        super.initialyze(r, "GPUtemp");
    }
}