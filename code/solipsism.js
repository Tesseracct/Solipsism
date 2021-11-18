document.getElementsByClassName("sidebar").item(0).style.display = "none";

const targetNode = document.getElementsByClassName("sidebar").item(0);
const config = { attributes: true, childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    let watchedElement = document.getElementsByClassName("action-large -watch").item(0)
    let watchedText = watchedElement.textContent

    if(!(watchedText === "logged" || watchedText === "reviewed")){
        // "Watched" and "Watch" tags have a different structure than "Logged" and "Reviewed"
        // and have to be handled separately
        watchedElement = watchedElement.children.item(0).childNodes.item(0).childNodes.item(0)
        watchedText = watchedElement.textContent

        if(!(watchedText === "Watched")){
            document.getElementsByClassName("section ratings-histogram-chart").item(0).style.display = "none";
        }
    }


    document.getElementsByClassName("sidebar").item(0).style.display = "block";
    observer.disconnect()
}


const observer = new MutationObserver(callback);
observer.observe(targetNode, config);



// TODO: In manifest: icon accessibility, refer to firefox icon style guide
// TODO: Themed Icons for browser action
// TODO: Show ratings dynamically when a film has been watched
