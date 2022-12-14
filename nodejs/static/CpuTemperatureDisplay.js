class CpuTemperatureDisplay{
    constructor(containerId, computerCores){
        this.receivedCoreStatus = []
        this.computerCores = computerCores
        this.container = document.querySelector(`#${containerId}`)
        
        const cpuTempContainer = this.container.querySelector("canvas")
        const cpuTempChartComposition = JSON.parse(JSON.stringify(lineChartComposition))
        cpuTempChartComposition.options.plugins.title.text = "CPU Temperature in Celsius"
        this.chart = new Chart(cpuTempContainer, cpuTempChartComposition)
    }

    initialize(){
        this.chart.data.datasets = [
            {
                type: "line",
                label: "# temp of CPU in celsius",
                data: Array(MAX_AMOUNT_LINE_DATA_DISPLAYED).fill(0)
            }
        ]
        this.chart.data.labels = Array(MAX_AMOUNT_LINE_DATA_DISPLAYED).fill(0);
        
        const lastData = getLastDataFromStorage(coreData);
        for(data of lastData){
            this.push(data, true);
        }
        this.update()
        this.receivedCoreStatus = [];
    }

    async push(corestatus, isDisplayed){

        if(this.chart.data.datasets.length != 1){
            this.initialize()
        }

        // First, we need to chec if we're on time : 
        // if we get the full data of the cpu core for 1 time.
        // We check that by checking if we have the first corestatus stored in memory
        let justOnTime = true;
        this.receivedCoreStatus.push(corestatus);
        if(this.receivedCoreStatus[0].idCore != this.computerCores[0].idCore){
            justOnTime = false;
            this.receivedCoreStatus = [];
        }

        // When we've got all the data, we get the mean and display it thanks to the chart
        if(justOnTime && this.receivedCoreStatus.length == this.computerCores.length){
            let averageTemp = 0;
            for(let cs of this.receivedCoreStatus){
                averageTemp += cs.coreTemp / computer.CPU.coreNumber;
            }
            let time = new Date(this.receivedCoreStatus[0].time);
            let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;
            
            this.chart.data.labels.push(timeString);
            this.chart.data.datasets[0].data.push(corestatus.coreTemp);
            if(this.chart.data.labels.length > MAX_AMOUNT_LINE_DATA_DISPLAYED){
                this.chart.data.labels.shift();
                this.chart.data.datasets[0].data.shift();
            }
            if(isDisplayed)
                this.update();

            this.receivedCoreStatus = [];
        }

    }

    update(){
        this.chart.update()
    }
}