class RamUsageDisplay{
    constructor(containerId, maxRamAmount){
        this.container = document.querySelector(`#${containerId}`)
        this.maxRamAmount = Number((maxRamAmount / Math.pow(1024,3)).toFixed(2))

        const canvas = this.container.querySelector("canvas")
        const composition = JSON.parse(JSON.stringify(lineChartComposition))
        composition.options.plugins.title.text = "Amount of RAM used"
        composition.options.scales.y.max = this.maxRamAmount
        this.chart = new Chart(canvas, composition)
    }

    initialize(){
        this.chart.data.datasets= [{
            type: "line",
            label: `RAM Usage`,
            data: Array(MAX_AMOUNT_LINE_DATA_DISPLAYED).fill(0)
        }]
        this.chart.data.labels = Array(MAX_AMOUNT_LINE_DATA_DISPLAYED).fill(0);
        const monitors = getLastDataFromStorage(monitorData);
        for(monitor of monitors){
            this.push(monitor, true);
        }
        this.update()
    }

    async push(monitor, isDisplayed){
        if(this.chart.data.datasets.length != 1){
            this.initialize()
        }

        // We then push the last monitor found
        let time = new Date(monitor.time);
        let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;

        let ramUsed = Number((monitor.RAMusage / Math.pow(1024,3)).toFixed(2))
        this.chart.data.datasets[0].data.push(ramUsed);
        this.chart.data.labels.push(timeString);

        // We shift the data if necessary
        if(this.chart.data.labels.length > MAX_AMOUNT_LINE_DATA_DISPLAYED){
            this.chart.data.labels.shift();
            this.chart.data.datasets[0].data.shift();
        }
        if(isDisplayed){
            this.update();
            this.container.querySelector("#usedRAM").innerHTML = `${Number(ramUsed.toFixed(2))} Gb (${Number((ramUsed/(this.maxRamAmount)*100).toFixed(2))}%)`
            this.container.querySelector("#availableRAM").innerHTML = `${this.maxRamAmount - ramUsed} Gb`
        }
    }

    update(){
        this.chart.update();
    }
}