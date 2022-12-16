class Display{

    constructor(containerId){
        this.container = document.querySelector(`#${containerId}`) // this
        const graphContainer = this.container.querySelector("div") // this
        this.graphId = graphContainer.id 

        this.dataToUpdate = {
            y: [[]],
            x: [[]]
        }

    }

    async push(){
        
    }
    update(){
        this.dataToUpdate = {
            y: [[]],
            x: [[]]
        }
    }
}