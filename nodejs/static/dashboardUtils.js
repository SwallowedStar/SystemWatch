const MAX_AMOUNT_LINE_DATA_DISPLAYED = 30;

// Gets raw data from database
async function getDataFromDatabase(table, isLiveStreaming){
    let currentDate = new Date();
    let previousDate =  new Date();
    if(isLiveStreaming){
        previousDate.setMinutes(previousDate.getMinutes() - 1);
    } else {
        previousDate.setHours(previousDate.getHours() - 24);
    }

    let finishDateString = `${currentDate.getFullYear()}-${('00'+(currentDate.getMonth()+1)).slice(-2)}-${('00'+(currentDate.getDate())).slice(-2)}/${('00'+(currentDate.getHours())).slice(-2)}:${('00'+(currentDate.getMinutes())).slice(-2)}:${('00'+(currentDate.getSeconds())).slice(-2)}`;
    let startDateString = `${previousDate.getFullYear()}-${('00'+(previousDate.getMonth()+1)).slice(-2)}-${('00'+(previousDate.getDate())).slice(-2)}/${('00'+(previousDate.getHours())).slice(-2)}:${('00'+(previousDate.getMinutes())).slice(-2)}:${('00'+(previousDate.getSeconds())).slice(-2)}`;
    let request = `http://${socketHost}/api/${table}/interval/${computer.computerID}/${startDateString}/${finishDateString}`;
    console.log(request);
    let response = await axios.get(request);
    return response.data;
}

function setVisibility(id, value){
    const elem = $("#"+id);
    if(value){
        elem.collapse("show"); 
    } else {
        elem.collapse("hide");
    }
}

// Gets the raw data from data base and turns it into usage data
function treatCoreStatus(rawData, computerCores){
    const time = []
    let coreDatas = []
    let cpuResult =[{
        temperature: [],
        usage: [], 
        time: time
    }]

    let coreResult = [];
    for(let i = 1; i <= computerCores.length; i++){
        coreResult.push({
            temperature: [],
            time: time
        })
    }

    for(let coreData of rawData){
        if(coreDatas[0] === undefined || coreDatas[0].idCore == computerCores[0].idCore){
            coreDatas.push(coreData);
            if(coreDatas.length == computerCores.length){
                if(coreDatas[coreDatas.length-1].idCore != computerCores[computerCores.length-1].idCore){
                    let n = 0
                    for(let i = 1; i < coreDatas.length; i++){
                        if(coreDatas[i].idCore == computerCores[0].idCore){
                            n = i; 
                        }
                    }
                    coreDatas = coreDatas.slice(n);
                    continue;
                }
                time.push(coreData.time);
                let averageTemp = 0;
                let averageCpuUsage = 0;
                for(let i = 0; i < computerCores.length; i++){
                    averageTemp += coreDatas[i].coreTemp / computerCores.length;
                    averageCpuUsage += coreDatas[i].coreUsage / computerCores.length;
                    coreResult[i].temperature.push(coreDatas[i].coreTemp)
                }
                cpuResult[0].temperature.push(averageTemp)
                cpuResult[0].usage.push(averageCpuUsage)
                coreDatas = []
            }
        }

    }

    return [cpuResult, coreResult]
}