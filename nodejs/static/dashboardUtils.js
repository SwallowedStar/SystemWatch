const MAX_AMOUNT_LINE_DATA_DISPLAYED = 30;

const lineChartComposition = {
    type: "line",
    options: {
        scales: {y: {beginAtZero: true}},
        plugins : {
            title: {display: true, text: "CPU Temperature in Celsius", font: {size: 24}}
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

function setVisibility(id, value){
    const elem = $("#"+id);
    if(value){
        elem.collapse("show"); 
    } else {
        elem.collapse("hide");
    }
}