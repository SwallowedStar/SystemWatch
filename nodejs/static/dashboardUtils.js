let receivedCoreStatus = [];
const coreData = [];
const monitorData = [];
const MAX_AMOUNT_LINE_DATA_DISPLAYED = 30;


const lineChartComposition = {
    type: "line",
    options: {
        scales: {
            y: {
                max: 100,
                beginAtZero: true
            }
        },
        animation: {
            duration: 0, // general animation time
        },
        plugins : {
            title: {
                display: true,
                text: "CPU Temperature in Celsius",
                font: {
                    size: 24,
                }
            }
        }
    }
}

async function displayCPUTemps(corestatus, chart, displayed){
    if(chart.data.datasets.length != 1){
        chart.data.datasets = [
            {
                type: "line",
                label: "# temp of CPU in celsius",
                data: Array(MAX_AMOUNT_LINE_DATA_DISPLAYED).fill(0)
            }
        ]
        chart.data.labels = Array(MAX_AMOUNT_LINE_DATA_DISPLAYED).fill(0);
        
        const lastData = getLastCoreDataFromStorage(coreData);
        for(data of lastData){
            displayCPUTemps(data, chart, displayCPUTemps);
        }
        receivedCoreStatus = [];
    }
    
    // First, we need to chec if we're on time : 
    // if we get the full data of the cpu core for 1 time.
    // We check that by checking if we have the first corestatus stored in memory
    let justOnTime = true;
    receivedCoreStatus.push(corestatus);
    if(receivedCoreStatus[0].idCore != computer.cores[0].idCore){
        justOnTime = false;
        receivedCoreStatus = [];
    }

    // When we've got all the data, we get the mean and display it thanks to the chart
    if(justOnTime && receivedCoreStatus.length == computer.CPU.coreNumber){
        let averageTemp = 0;
        for(let cs of receivedCoreStatus){
            averageTemp += cs.coreTemp / computer.CPU.coreNumber;
        }
        let time = new Date(receivedCoreStatus[0].time);
        let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;
        
        chart.data.labels.push(timeString);
        chart.data.datasets[0].data.push(corestatus.coreTemp);
        if(chart.data.labels.length > MAX_AMOUNT_LINE_DATA_DISPLAYED){
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        if(displayed)
            chart.update();

        receivedCoreStatus = [];
    }
}

async function displayCoreCPUTemps(corestatus, chart, displayed){
    if(chart.data.datasets.length != computer.CPU.coreNumber){
        for(let i = 0; i < computer.CPU.coreNumber; i++ ){
            chart.data.datasets[i] = {
                type: "line",
                label: `CPU Core ${i}`,
                data: Array(MAX_AMOUNT_LINE_DATA_DISPLAYED).fill(0)
            }
        }
        chart.data.labels = Array(MAX_AMOUNT_LINE_DATA_DISPLAYED).fill(0);
    
        const lastData = getLastCoreDataFromStorage(coreData);
        for(data of lastData){
            displayCoreCPUTemps(data, chart, displayed);
        }
        receivedCoreStatus = [];
    }
    

    for(let i = 0; i < computer.CPU.coreNumber; i++ ){
        if(corestatus.idCore == computer.cores[i].idCore){
            chart.data.datasets[i].data.push(corestatus.coreTemp);
            break;
        }
    }

    let time = new Date(corestatus.time);
    let timeString = `${('00'+(time.getHours())).slice(-2)}:${('00'+(time.getMinutes())).slice(-2)}:${('00'+(time.getSeconds())).slice(-2)}`;
    
    if(!chart.data.labels.includes(timeString)){
        chart.data.labels.push(timeString);
    }
    
    if(chart.data.labels.length > MAX_AMOUNT_LINE_DATA_DISPLAYED){
        chart.data.labels.shift();
        for(let i = 0; i < chart.data.datasets.length; i++){
            chart.data.datasets[i].data.shift();
        }
    }
    if(displayed)
        chart.update();
}

async function getCoreDataFromDatabase(){
    let currentDate = new Date();
    let previousDate =  new Date();
    previousDate.setMinutes(previousDate.getMinutes() - 1);

    let finishDateString = `${currentDate.getFullYear()}-${('00'+(currentDate.getMonth()+1)).slice(-2)}-${('00'+(currentDate.getDate())).slice(-2)}/${('00'+(currentDate.getHours())).slice(-2)}:${('00'+(currentDate.getMinutes())).slice(-2)}:${('00'+(currentDate.getSeconds())).slice(-2)}`;
    let startDateString = `${previousDate.getFullYear()}-${('00'+(previousDate.getMonth()+1)).slice(-2)}-${('00'+(previousDate.getDate())).slice(-2)}/${('00'+(previousDate.getHours())).slice(-2)}:${('00'+(previousDate.getMinutes())).slice(-2)}:${('00'+(previousDate.getSeconds())).slice(-2)}`;
    let response = await axios.get(`http://${socketHost}/api/corestatus/interval/${computer.computerID}/${startDateString}/${finishDateString}`);
    return response.data;
}

function getLastCoreDataFromStorage(data){
    // TODO: this function looks into the local storage and 
    // get the data that's less than 1 minute old
    let previousDate =  new Date();
    previousDate.setMinutes(previousDate.getMinutes() - 2);

    // We can do a reverse for and get all the data that is correct
    const freshData = [];
    for(let i = data.length-1; i >= 0; i --){
        const corestatus = data[i];
        const coreTime = new Date(corestatus.time);
        
        freshData.push(corestatus);
        if(coreTime < previousDate){
            break;
        }
    }
    freshData.shift();
    return freshData;
}

function toggle(id){
    const elem = document.querySelector("#"+id);
    if(elem.style.display == "none"){
        elem.style.display = "block"; 
    } else {
        elem.style.display = "none"; 
    }
}