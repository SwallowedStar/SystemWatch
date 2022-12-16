class CoreTemperatureDisplay extends Display{
    constructor(containerId, computerCores, existingData){
        super(containerId);
        this.receivedCoreStatus = 0;
        this.computerCores = computerCores;
        // this.dataToUpdate.x = Array(computerCores.length).fill([])
        this.dataToUpdate.x = []
        this.dataToUpdate.y = []
        const data =[]

        this.computerCores.forEach((_)=>{
            this.dataToUpdate.x.push([])
            this.dataToUpdate.y.push([])
            data.push({x:[], y:[]})
        })
        // We initialize data
        for(let i = 0; i < MAX_AMOUNT_LINE_DATA_DISPLAYED * this.computerCores.length; i+=this.computerCores.length){
            let corestatus = existingData[i];
            if(corestatus !== undefined){
                let time = new Date(corestatus.time);
                let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;

                let corestatuses = existingData.slice(i, i + this.computerCores.length);
                
                let onTime = true;
                corestatuses.forEach((e)=>{onTime = onTime && (corestatuses[0].time == e.time);});
                if(corestatuses.length == this.computerCores.length && onTime){
                    for(let j = 0; j < this.computerCores.length; j++){
                        data[j].x.push(timeString);
                        data[j].y.push(corestatuses[j].coreTemp);
                    }
                } 
            } else {
                for(let j = 0; j < this.computerCores.length; j++){
                    data[j].x.unshift(0);
                    data[j].y.unshift(0);
                }
            }
        }
        const layout = {
            title: "CPU Temperature in Celsius",
            xaxis: {
                title: "Time",
                rangemode: 'tozero',
                range : [0, MAX_AMOUNT_LINE_DATA_DISPLAYED]
            },
            yaxis: {
                title: "Core Temperature in Celsius",
                range: [0,100]
            }
        }
        Plotly.newPlot(this.graphId, data, layout);
    }

    async push(corestatus){

        this.receivedCoreStatus += 1
        
        let time = new Date(corestatus.time);
        let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;
        
        for(let k = 0; k < this.computerCores.length; k++ ){
            if(corestatus.idCore == this.computerCores[k].idCore){

                this.dataToUpdate.y[k].push(corestatus.coreTemp);
                this.dataToUpdate.x[k].push(timeString);
                break;
            }
        }

        if(this.receivedCoreStatus == this.computerCores.length){
            this.update();
            this.receivedCoreStatus = 0
        }
    }
    update(){
        Plotly.extendTraces(this.graphId, this.dataToUpdate, Array(this.computerCores.length).fill().map((v,i)=>i));
        super.update()
        this.dataToUpdate.x = [[],[],[],[]]
        this.dataToUpdate.y = [[],[],[],[]]
    }
}