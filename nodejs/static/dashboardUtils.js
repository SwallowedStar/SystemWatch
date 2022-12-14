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
            duration: 0, // disable animations
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

async function getDataFromDatabase(table){
    let currentDate = new Date();
    let previousDate =  new Date();
    previousDate.setMinutes(previousDate.getMinutes() - 1);

    let finishDateString = `${currentDate.getFullYear()}-${('00'+(currentDate.getMonth()+1)).slice(-2)}-${('00'+(currentDate.getDate())).slice(-2)}/${('00'+(currentDate.getHours())).slice(-2)}:${('00'+(currentDate.getMinutes())).slice(-2)}:${('00'+(currentDate.getSeconds())).slice(-2)}`;
    let startDateString = `${previousDate.getFullYear()}-${('00'+(previousDate.getMonth()+1)).slice(-2)}-${('00'+(previousDate.getDate())).slice(-2)}/${('00'+(previousDate.getHours())).slice(-2)}:${('00'+(previousDate.getMinutes())).slice(-2)}:${('00'+(previousDate.getSeconds())).slice(-2)}`;
    let response = await axios.get(`http://${socketHost}/api/${table}/interval/${computer.computerID}/${startDateString}/${finishDateString}`);
    return response.data;
}

// gets the last 2 minutes of data stored in local storage
function getLastDataFromStorage(data){
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

// toggles display of an HTML element with a certain id
function toggle(id){
    const elem = document.querySelector("#"+id);
    if(elem.style.display == "none"){
        elem.style.display = "block"; 
    } else {
        elem.style.display = "none"; 
    }
}