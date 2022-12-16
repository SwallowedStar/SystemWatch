class Display{

    constructor(containerId){
        this.xRange = [0, 30] // this
        this.count = 0 // this

        this.container = document.querySelector(`#${containerId}`) // this
        const graphContainer = this.container.querySelector("div") // this
        this.graphId = graphContainer.id // this

        this.dataToUpdate = { // this
            y: [[]],
            x: [[]]
        }

    }

    async push(){
        
    }
    update(){
        this.count ++;
        this.xRange = [this.xRange[0] + 1, this.xRange[1] + 1]
        Plotly.relayout(
            this.graphId, {
                xaxis: {
                    range: this.xRange
                }
            })
        this.dataToUpdate = {
            y: [[]],
            x: [[]]
        }
    }
}