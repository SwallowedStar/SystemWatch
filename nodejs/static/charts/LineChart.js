class LineChart{
    constructor(containerId, isLiveStreaming){
        this.containerId = containerId;
        this.container = document.querySelector(`#${containerId}`); 
        const graphContainer = this.container.querySelector(".canvas");
        this.graphId = graphContainer.id ;
        this.range = [0, MAX_AMOUNT_LINE_DATA_DISPLAYED];

        const mode = isLiveStreaming ? 'lines+markers' : 'lines';
        
        this.dataGraph = [{
            x:[],
            y:[],
            mode: mode
        }];
        
        this.layout = {
            editable: true,
            xaxis: {
                title: "Time",
                rangemode: "tozerro",
                range: this.range
            }
        };
        if(!isLiveStreaming){
            this.layout.xaxis.range = null;
            this.layout.xaxis.rangeslider = {};
        }
        this.count = 0;

        this.dataToUpdate = {
            x: [[]],
            y: [[]]
        };
    }

    async push(){
        
    }
    update(){
        if(this.dataGraph[0].x.length > MAX_AMOUNT_LINE_DATA_DISPLAYED){
            for(let i = 0; i < this.dataGraph.length; i++){
                this.dataGraph[i].x.shift();
                this.dataGraph[i].y.shift();
            }
        }
        try{
            this.count ++;
            Plotly.extendTraces(this.graphId, this.dataToUpdate, Array(this.dataToUpdate.x.length).fill().map((v,i)=>i));
        } catch (e) {
            this.container = document.querySelector(`#${this.containerId}`);
            let newData = JSON.parse(JSON.stringify(this.dataGraph))
            Plotly.newPlot(this.graphId, newData, this.layout);
        }

        this.dataToUpdate = {
            y: [[]],
            x: [[]]
        }
    }

    async initialyze(coreData, column){
        for(let i = 0; i < this.dataGraph.length; i++){
            this.dataGraph[i].x = JSON.parse(JSON.stringify(coreData[i].time));
            this.dataGraph[i].y = JSON.parse(JSON.stringify(coreData[i][column]));
        }
        
        await Plotly.newPlot(this.graphId, JSON.parse(JSON.stringify(this.dataGraph)), this.layout);
    }
}