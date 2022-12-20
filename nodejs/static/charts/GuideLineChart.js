class GuideLineChart extends Display {
    constructor(containerId){
        super(containerId)
        this.data = [{
            x: [],
            y: [],
        }]
        this.layout = {
            title: "CPU Usage in % over time",
            xaxis: {
                range : this.range
            },
        }
        this.count = 0
        Plotly.newPlot(this.graphId, this.data, this.layout);
    }
    async push(){
        this.count ++
        this.dataToUpdate = {
            y: [[this.count]],
            x: [[0]]
        }
        this.update();
    }
}