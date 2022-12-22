const observers = []

async function resizeCallback(entries, chart, observerIndex){
    let newDimensions = {
        width: entries[0].contentRect.width, 
        height: entries[0].contentRect.height
    };

    let other = document.querySelector("#"+chart.containerId).querySelector(".extra-infos");
    if(other !== null){
        newDimensions.height -= other.offsetHeight
    }

    try{
        Plotly.relayout(chart.graphId, newDimensions)
    } catch(e) {
        // If there is an error here, It means that the container have been moved around and cannot be pinpointed.
        observers[observerIndex].unobserve(chart.container)
        observers[observerIndex].observe(document.querySelector(`#${chart.containerId}`))
    }
}


// Creates a list of ResizeObservers to check if a graph has been resized 
function createResizeObservers(charts){
    for(let chart of charts){
        let i = observers.length;
        let resizeObserver = new ResizeObserver((entries) => {resizeCallback(entries, chart, i)})
        resizeObserver.observe(chart.container)
        observers.push(resizeObserver)
    }
}