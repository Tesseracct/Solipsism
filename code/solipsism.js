document.getElementsByClassName("sidebar").item(0).style.display = "none";


const targetNode = document.getElementsByClassName("sidebar").item(0);
const config = { attributes: true, childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    const watchedElement = document.getElementsByClassName("action-large -watch").item(0)
    const watchedText = watchedElement.textContent

    if(!(watchedText === "logged" || watchedText === "reviewed")){
        document.getElementsByClassName("section ratings-histogram-chart").item(0).style.display = "none";
    }

    document.getElementsByClassName("sidebar").item(0).style.display = "block";
    observer.disconnect()
}

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);


