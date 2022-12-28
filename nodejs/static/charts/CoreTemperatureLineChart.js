class CoreTemperatureLineChart extends LineChart{
    constructor(containerId, computerCores, isLiveStreaming){
        super(containerId, isLiveStreaming);
        this.receivedCoreStatus = 0;
        this.computerCores = computerCores;
        this.dataToUpdate.x = []
        this.dataToUpdate.y = []
        this.dataGraph =[]

        const mode = isLiveStreaming ? 'lines+markers' : 'lines';

        for(let i = 1; i <= this.computerCores.length; i ++){
            this.dataToUpdate.x.push([])
            this.dataToUpdate.y.push([])
            this.dataGraph.push({x:[], y:[], mode: mode, name:`Core ${i}`})
        }

        this.layout.title = "CPU Temperature in Celsius";
        this.layout.yaxis = {
            title: "Core Temperature in Celsius",
            range: [0,100]
        };
    }

    async push(corestatus){

        this.receivedCoreStatus += 1
        
        let timeString = corestatus.time;
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

    async initialyze(coreDatas){
        super.initialyze(coreDatas, "temperature")
    }
}