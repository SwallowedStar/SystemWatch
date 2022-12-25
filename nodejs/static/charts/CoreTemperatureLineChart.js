class CoreTemperatureLineChart extends LineChart{
    constructor(containerId, computerCores){
        super(containerId);
        this.receivedCoreStatus = 0;
        this.computerCores = computerCores;
        this.dataToUpdate.x = []
        this.dataToUpdate.y = []
        this.dataGraph =[]

        for(let i = 1; i <= this.computerCores.length; i ++){
            this.dataToUpdate.x.push([])
            this.dataToUpdate.y.push([])
            this.dataGraph.push({x:[], y:[], mode: 'lines+markers', name:`Core ${i}`})
        }


        this.layout = {
            title: "CPU Temperature in Celsius",
            editable: true,
            width: 600,
            xaxis: {
                title: "Time",
                rangemode: 'tozero',
                range : this.range
            },
            yaxis: {
                title: "Core Temperature in Celsius",
                range: [0,100]
            }
        }
        Plotly.newPlot(this.graphId, JSON.parse(JSON.stringify(this.dataGraph)), this.layout);
    }

    async push(corestatus){

        this.receivedCoreStatus += 1
        
        let time = new Date(corestatus.time);
        let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;
        
        for(let k = 0; k < this.computerCores.length; k++ ){
            if(corestatus.idCore == this.computerCores[k].idCore){

                this.dataToUpdate.y[k].push(corestatus.coreTemp);
                this.dataToUpdate.x[k].push(timeString);

                this.dataGraph[k].x.push(timeString)
                this.dataGraph[k].y.push(corestatus.coreTemp)
                break;
            }
        }
        if(this.receivedCoreStatus == this.computerCores.length){
            this.update();
            this.receivedCoreStatus = 0
        }
    }
    update(){
        super.update()  
        this.dataToUpdate.x = []
        this.dataToUpdate.y = []

        for(let i = 1; i <= this.computerCores.length; i ++){
            this.dataToUpdate.x.push([])
            this.dataToUpdate.y.push([])
        }
    }
}