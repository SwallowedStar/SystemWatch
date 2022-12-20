class CpuTemperatureGaugeChart{
    constructor(containerId, computerCores, existingData){
        this.container = document.querySelector(`#${containerId}`)
        const graphContainer = this.container.querySelector("div")
        this.graphId = graphContainer.id
        this.receivedCoreStatus = [];
        this.dataToUpdate = {
            value: 0,
            delta: { reference: 50, increasing: { color: "red" }, decreasing: {color: "blue"}  }
        }
        this.computerCores = computerCores;

        let data = [
            {
                type: "indicator",
                mode: "gauge+number+delta",
                domain: { row: 0, column: 0 },
                number : {'suffix': "°C"},
                value: 50,
                title: {
                    text: "CPU Temperature in Degree Celsius", 
                    font: { size: 24 }
                },
                gauge: {
                    axis: { range: [0, 100]},
                    steps: [
                        {range: [60,85], color: "orange"},
                        {range: [85,100], color: "red"},
                    ]
                }
            }
        ]

        const layout = {
            margin: {t: 0, b: 0}, 
            width: 600, 
            height: 450
        }

        Plotly.newPlot(this.graphId, data, layout)
        
        for(let i = existingData.length - 8; i < existingData.length; i++){
            this.push(existingData[i])
        }
    }

    async push(corestatus){
        this.receivedCoreStatus.push(corestatus)
        if(this.receivedCoreStatus[0].idCore != this.computerCores[0].idCore){
            this.receivedCoreStatus = [];
        } else if(this.receivedCoreStatus.length == this.computerCores.length){
            let averageTemp = 0;
            for(let cs of this.receivedCoreStatus){
                averageTemp += cs.coreTemp / computer.CPU.coreNumber;
            }
            this.dataToUpdate.delta.reference = this.dataToUpdate.value;
            this.dataToUpdate.value = averageTemp;
            this.receivedCoreStatus = [];
        }
        this.update()
    }
    update(){
        Plotly.update(this.graphId, this.dataToUpdate, {}, [0])
    }
}