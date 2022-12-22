class Display{
    constructor(containerId){
        this.containerId = containerId;
        this.container = document.querySelector(`#${containerId}`); 
        const graphContainer = this.container.querySelector("div");
        this.graphId = graphContainer.id ;
        this.range = [-MAX_AMOUNT_LINE_DATA_DISPLAYED, 0];
        this.data = [];
        this.layout = {};

        this.dataToUpdate = {
            y: [[]],
            x: [[]]
        };

    }

    async push(){
        
    }
    update(){
        try{
            Plotly.extendTraces(this.graphId, this.dataToUpdate, Array(this.dataToUpdate.length).fill().map((v,i)=>i));
        } catch (e) {
            
            this.container = document.querySelector(`#${this.containerId}`);
            Plotly.newPlot(this.graphId, this.data, this.layout);
        }

        this.dataToUpdate = {
            y: [[]],
            x: [[]]
        }
    }
}