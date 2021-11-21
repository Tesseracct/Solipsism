document.getElementsByClassName("sidebar").item(0).style.display = "none";
let active = true


async function checkActivated() {
    const temp = await browser.storage.local.get("activated")
    active = temp.activated

    if(!active){
        document.getElementsByClassName("sidebar").item(0).style.display = "block";
        const chart = document.getElementsByClassName("section ratings-histogram-chart").item(0)
        // Checking for null to prevent error messages
        if(chart !== null){
            chart.style.display = "block"
        }
    }
}
checkActivated()


function hasBeenSeen(){
    let watchedElement = document.getElementsByClassName("action-large -watch").item(0)
    let watchedText = watchedElement.textContent

    if(watchedText !== "logged" && watchedText !== "reviewed") {
        // "Watched" and "Watch" tags have a different structure than "Logged" and "Reviewed"
        // and have to be handled separately
        watchedElement = watchedElement.children.item(0).childNodes.item(0).childNodes.item(0)
        watchedText = watchedElement.textContent

        return watchedText === "Watched";
    }
    else {
        return true
    }
}

const callback = function(mutationsList, observer) {
    if(!hasBeenSeen() && active){
        document.getElementsByClassName("section ratings-histogram-chart").item(0).style.display = "none";
    }

    document.getElementsByClassName("sidebar").item(0).style.display = "block";
    observer.disconnect()
}


const targetNode = document.getElementsByClassName("sidebar").item(0);
const config = { attributes: true, childList: true, subtree: true };

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
