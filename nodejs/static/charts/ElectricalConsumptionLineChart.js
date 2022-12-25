class ElectricalConsumptionLineChart extends LineChart{
    constructor(containerId){
        super(containerId);

        this.dataGraph = [{
            x: [],
            y: [],
            mode: 'lines+markers'
        }]

        this.layout = {
            title: "Electrical Consumption",
            editable: true,
            xaxis: {
                title: " Time",
                rangemode: "tozerro",
                range: this.range
            },
            yaxis: {
                title: "Kilo Watts"
            }
        }
        Plotly.newPlot(this.graphId, JSON.parse(JSON.stringify(this.dataGraph)), this.layout)
    }
    async push(monitor){
        let time = new Date(monitor.time);
        let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;

        let electricalConsumption = monitor.electricalConsumption;
        this.dataToUpdate.y[0].push(electricalConsumption);
        this.dataToUpdate.x[0].push(timeString);

        this.dataGraph[0].x.push(timeString);
        this.dataGraph[0].y.push(electricalConsumption);

        this.update();
    }
}