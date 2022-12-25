class CpuTemperatureGaugeChart{
    constructor(containerId, computerCores){
        this.containerId = containerId;
        this.container = document.querySelector(`#${containerId}`)
        const graphContainer = this.container.querySelector("div")
        this.graphId = graphContainer.id
        this.receivedCoreStatus = [];

        this.computerCores = computerCores;

        this.data = [
            {
                type: "indicator",
                mode: "gauge+number+delta",
                domain: { row: 0, column: 0 },
                number : {'suffix': "°C"},
                value: 50,
                delta: { reference: 50, increasing: { color: "red" }, decreasing: {color: "blue"}  },
                title: {text: "CPU Temperature in Degree Celsius"},
                gauge: {
                    axis: { range: [0, 100]},
                    steps: [
                        {range: [60,85], color: "orange"},
                        {range: [85,100], color: "red"},
                    ]
                }
            }
        ]

        this.layout = {
            margin: {t: 0, b: 0}, 
            editable: true,
        }

        Plotly.newPlot(this.graphId, this.data, this.layout)
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
            this.data[0].delta.reference = this.data[0].value;
            this.data[0].value = averageTemp;
            this.receivedCoreStatus = [];
        }
        this.update()
    }
    update(){
        try{
            Plotly.update(this.graphId, this.data[0], {}, [0])
        } catch (e) {
            this.container = document.querySelector(`#${this.containerId}`);
            Plotly.newPlot(this.graphId, this.data, this.layout)
        }
    }
}