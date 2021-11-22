const sideBar = document.getElementsByClassName("sidebar").item(0)
const reviews = document.getElementsByClassName("film-recent-reviews").item(0)
const column = document.getElementsByClassName("col-17").item(0)
column.style.display = "none"
sideBar.style.display = "none"
reviews.style.display = "none"
let active = true
let hideReviews = true
let hideFriends = true


async function checkActivated() {
    const temp = await browser.storage.local.get("activated")
    active = temp.activated

    if(!active){
        column.style.display = "block"
        sideBar.style.display = "block"
        reviews.style.display = "block"
        const chart = document.getElementsByClassName("section ratings-histogram-chart").item(0)
        // Checking for null to prevent error messages
        if(chart !== null){
            chart.style.display = "block"
        }
    }
    else {
        checkSettings()
    }
}
checkActivated()


async function checkSettings() {
    let temp = await browser.storage.local.get("hideReviews")
    hideReviews = temp.hideReviews
    console.log("test")
    temp = await browser.storage.local.get("hideFriends")
    hideFriends = temp.hideFriends
    console.log(hideFriends)

    if(!hideReviews){
        reviews.style.display = "block"
    }
    if(!hideFriends){
         column.style.display = "block"
    }
}


function hasBeenSeen(){
    let watchedElement = document.getElementsByClassName("action-large -watch").item(0)
    let watchedText = watchedElement.textContent

    if(watchedText !== "logged" && watchedText !== "reviewed") {
        // "Watched" and "Watch" tags have a different structure than "Logged" and "Reviewed"
        // and have to be handled separately
        watchedElement = watchedElement.children.item(0).childNodes.item(0).childNodes.item(0)
        watchedText = watchedElement.textContent

        return watchedText === "Watched"
    }
    else {
        return true
    }
}

function hideOrListenFriends(){
    const friends = document.getElementsByClassName("section activity-from-friends -clear -friends-watched -no-friends-want-to-watch").item(0)

    if(friends !== null){
        friends.style.display = "none"
        column.style.display = "block"
    }
    else { // Just in case friends hasn't loaded yet
        const columnObserver = new MutationObserver((e, a) => {
            const friends = document.getElementsByClassName("section activity-from-friends -clear -friends-watched -no-friends-want-to-watch").item(0)
            if(friends !== null){
                friends.style.display = "none"
                column.style.display = "block"
                columnObserver.disconnect()
            }
        })
        columnObserver.observe(targetNode, config)
    }
}

const hideElements = function(mutationsList, observer) {
    if(hasBeenSeen()){
        reviews.style.display = "block"
        column.style.display = "block"
    }
    else {
        if(active){
            document.getElementsByClassName("section ratings-histogram-chart").item(0).style.display = "none"
            if(hideFriends){
                hideOrListenFriends()
            }
        }
    }

    sideBar.style.display = "block"
    observer.disconnect()
}


const targetNode = sideBar
const config = { attributes: true, childList: true, subtree: true }


const sidebarObserver = new MutationObserver(hideElements)
sidebarObserver.observe(targetNode,config)
