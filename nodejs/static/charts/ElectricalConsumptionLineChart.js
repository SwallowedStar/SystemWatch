class ElectricalConsumptionLineChart extends LineChart{
    constructor(containerId, isLiveStreaming){
        super(containerId, isLiveStreaming);

        this.layout.title = "Electrical Consumption";
        this.layout.yaxis = { title: "Kilo Watts" };
    }
    async push(monitor){
        let timeString = monitor.time;

        let electricalConsumption = monitor.electricalConsumption;
        this.dataToUpdate.y[0].push(electricalConsumption);
        this.dataToUpdate.x[0].push(timeString);

        this.dataGraph[0].x.push(timeString);
        this.dataGraph[0].y.push(electricalConsumption);

        this.update();
    }
    async initialyze(monitors){
        
        let r = [
            {
                electricalConsumption: [], 
                time: []
            }
        ]
        monitors.forEach(element => {
            r[0].electricalConsumption.push(Number(element.electricalConsumption))
            r[0].time.push(element.time)
        });
        super.initialyze(r, "electricalConsumption");
    }
}