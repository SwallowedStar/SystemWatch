class CoreTemperatureDisplay{
    constructor(containerId, computerCores){
        this.computerCores = computerCores
        
        this.container = document.querySelector(`#${containerId}`)
        const canvas = this.container.querySelector("canvas")
        const composition = JSON.parse(JSON.stringify(lineChartComposition))
        composition.options.plugins.title.text = "Core Temperatures in Celsius"
        this.chart = new Chart(canvas, composition)
        // Ici, il y a un dilemn, est ce que c'est mieux de ne rien montrer
        //this.initialize() 
    }
    initialize(){
        for(let i = 0; i < this.computerCores.length; i++ ){
            this.chart.data.datasets[i] = {
                type: "line",
                label: `CPU Core ${i}`,
                data: Array(MAX_AMOUNT_LINE_DATA_DISPLAYED).fill(0)
            }
        }
        this.chart.data.labels = Array(MAX_AMOUNT_LINE_DATA_DISPLAYED).fill(0);
    
        const lastData = getLastDataFromStorage(coreData);
        for(data of lastData){
            this.push(data, true);
        }
        //this.update()
    }
    async push(corestatus, isDisplayed){
        if(this.chart.data.datasets.length != this.computerCores.length){
            this.initialize()
        }

        for(let i = 0; i < this.computerCores.length; i++ ){
            if(corestatus.idCore == this.computerCores[i].idCore){
                this.chart.data.datasets[i].data.push(corestatus.coreTemp);
                break;
            }
        }
    
        let time = new Date(corestatus.time);
        let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;
        
        if(!this.chart.data.labels.includes(timeString)){
            this.chart.data.labels.push(timeString);
        }
        
        if(this.chart.data.labels.length > MAX_AMOUNT_LINE_DATA_DISPLAYED){
            this.chart.data.labels.shift();
            for(let i = 0; i < this.chart.data.datasets.length; i++){
                this.chart.data.datasets[i].data.shift();
            }
        }
        if(isDisplayed)
            this.update();
    }
    update(){
        this.chart.update()
    }
}