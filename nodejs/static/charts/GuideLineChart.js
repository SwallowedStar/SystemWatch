class GuideLineChart extends LineChart {
    constructor(containerId, isLiveStreaming){
        super(containerId, isLiveStreaming)
        this.dataGraph = [{
            x: [],
            y: [],
        }]
        this.layout = {
            title: "CPU Usage in % over time",
            xaxis: {
                range : this.range
            },
        }
        Plotly.newPlot(this.graphId, this.dataGraph, this.layout);
    }
    async push(monitor){
        this.count ++
        this.dataToUpdate = {
            y: [[0]],
            x: [[monitor.time]]
        }
        this.update();
    }
    async initialyze(cpuDatas, isLiveStreaming){
        super.initialyze(cpuDatas, "usage");
        if(isLiveStreaming){
            let newRange = [this.dataGraph[0].x[0], this.dataGraph[0].x[this.dataGraph[0].x.length-1]]
            Plotly.relayout(this.graphId, {xaxis:{range: newRange}});
        }
    }
}