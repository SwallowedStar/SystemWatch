const observers = []

async function resizeCallback(entries, resizable, observerIndex){
    let newDimensions = {
        width: entries[0].contentRect.width, 
        height: entries[0].contentRect.height
    };
    let other = resizable.querySelector(".extra-infos");
    if(other !== null){
        newDimensions.height -= other.offsetHeight;
    }
    for(let chartContainer of resizable.querySelectorAll(".chart-container")){
        try{
            Plotly.relayout(chartContainer.querySelector(".canvas").id, newDimensions);
        } catch(e) {
            // If there is an error here, It means that the container have been moved around and cannot be pinpointed.
            observers[observerIndex].unobserve(resizable)
            observers[observerIndex].observe(document.querySelector(`#${resizable.id}`))
        }
    } 
}

// Creates a list of ResizeObservers to check if a graph has been resized 
function createResizeObservers(resizableId){
    let resizables = document.querySelectorAll("."+resizableId);
    for(let i = 0; i < resizables.length; i++){
        let resizable = resizables[i];
        if(!resizable.id){
            resizable.id = "resizable"+i; //!We want to be able to find the section when its being moved across the page
        }

        let resizeObserver = new ResizeObserver((entries) => {resizeCallback(entries, resizable, i)})
        resizeObserver.observe(resizable)
        observers.push(resizeObserver)
    }
}