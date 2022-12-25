class LineChart{
    constructor(containerId){
        this.containerId = containerId;
        this.container = document.querySelector(`#${containerId}`); 
        const graphContainer = this.container.querySelector(".canvas");
        this.graphId = graphContainer.id ;
        this.range = [-MAX_AMOUNT_LINE_DATA_DISPLAYED, 0];
        this.dataGraph = [];
        this.layout = {};
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
            let fillerY = Array(this.count - MAX_AMOUNT_LINE_DATA_DISPLAYED > 0 ? this.count - MAX_AMOUNT_LINE_DATA_DISPLAYED : 0).fill(0)
            let fillerX = Array(this.count - MAX_AMOUNT_LINE_DATA_DISPLAYED > 0 ? this.count - MAX_AMOUNT_LINE_DATA_DISPLAYED : 0).fill().map((v,i)=>i)
            for(let i = 0; i < newData.length; i++){
                newData[i].x = fillerX.concat(newData[i].x)
                newData[i].y = fillerY.concat(newData[i].y)
            }
            Plotly.newPlot(this.graphId, newData, this.layout);
        }

        this.dataToUpdate = {
            y: [[]],
            x: [[]]
        }
    }
}