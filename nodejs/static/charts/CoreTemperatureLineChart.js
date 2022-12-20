class CoreTemperatureLineChart extends Display{
    constructor(containerId, computerCores){
        super(containerId);
        this.receivedCoreStatus = 0;
        this.computerCores = computerCores;
        this.dataToUpdate.x = []
        this.dataToUpdate.y = []
        this.data =[]

        for(let i = 1; i <= this.computerCores.length; i ++){
            this.dataToUpdate.x.push([])
            this.dataToUpdate.y.push([])
            this.data.push({x:[], y:[], mode: 'lines+markers', name:`Core ${i}`})
        }

        this.layout = {
            title: "CPU Temperature in Celsius",
            editable: true,
            dragmode: 'swap',
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
        Plotly.newPlot(this.graphId, this.data, this.layout);
    }

    async push(corestatus){

        this.receivedCoreStatus += 1
        
        let time = new Date(corestatus.time);
        let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;
        
        for(let k = 0; k < this.computerCores.length; k++ ){
            if(corestatus.idCore == this.computerCores[k].idCore){

                this.dataToUpdate.y[k].push(corestatus.coreTemp);
                this.dataToUpdate.x[k].push(timeString);

                this.data[k].x.push(timeString)
                this.data[k].y.push(corestatus.coreTemp)
                break;
            }
        }

        if(this.receivedCoreStatus == this.computerCores.length){
            this.update();
            this.receivedCoreStatus = 0
        }

        // TODO: Update this.data along the way. keep only 100 data points
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