const sideBar = document.getElementsByClassName("sidebar").item(0)
const reviews = document.getElementsByClassName("film-recent-reviews").item(0)
const column = document.getElementsByClassName("col-17").item(0)

column.style.display = "none"
sideBar.style.display = "none"
reviews.style.display = "none"

let recentReviews = null
let popularReviews = null
let friendReviews = null

let viewed = false
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
        readSettings()
    }
    else {
        await readSettings()

        if(!hideReviews){
            reviews.style.display = "block"
        }
        if(!hideFriends){
            column.style.display = "block"
        }
    }
}


async function readSettings() {
    let temp = await browser.storage.local.get("hideReviews")
    hideReviews = temp.hideReviews
    temp = await browser.storage.local.get("hideFriends")
    hideFriends = temp.hideFriends
}


function hasBeenSeen(){
    let watchedElement = document.getElementsByClassName("action-large -watch").item(0)
    let watchedText = watchedElement.textContent

    if(watchedText !== "logged" && watchedText !== "reviewed") {
        // "Watched" and "Watch" tags have a different structure than "Logged" and "Reviewed"
        // and have to be handled separately
        watchedElement = watchedElement.children.item(0).childNodes.item(0).childNodes.item(0)
        watchedText = watchedElement.textContent

        listenWatchedEvent()

        return watchedText === "Watched"
    }
    else {
        listenWatchedEvent()
        return true
    }
}


function hideOrListenFriends(){
    const friends = getFriendActivitySection()

    if(friends !== null){
        friends.style.display = "none"
        column.style.display = "block"
    }
    else { // Just in case friends hasn't loaded yet
        const columnObserver = new MutationObserver((e, a) => {
            const friends = getFriendActivitySection()
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
    viewed = hasBeenSeen()
    if(viewed){
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


const listenReviews = function(mutationsList, observer) {
    if(recentReviews === null) {recentReviews  = document.getElementById("recent-reviews").getElementsByClassName("film-popular-review").item(0)}
    if(popularReviews === null) {popularReviews = document.getElementById("popular-reviews").getElementsByClassName("film-popular-review").item(0)}
    if(friendReviews === null) {friendReviews = document.getElementById("popular-reviews-with-friends").getElementsByClassName("film-popular-review").item(0)}
    if(recentReviews !== null && popularReviews !== null && friendReviews !== null) {
        observer.disconnect()
        if (active && hideReviews && !viewed) {
            toggleAllReviews("none")
        }
        // fHideReviews()
        reviews.style.display = "block"
    }
}

function toggleAllReviews(styleCommand) {
    recentReviews.style.display = styleCommand
    popularReviews.style.display = styleCommand
    friendReviews.style.display = styleCommand
}

function toggleFriends(styleCommand) {
    getFriendActivitySection().style.display = styleCommand
    friendReviews.style.display = styleCommand
}

async function listenWatchedEvent() {
    const targetNode = document.getElementsByClassName("action-large -watch").item(0)
    const config = { attributes: true, childList: true, subtree: true }

    const watchButtonObserver = new MutationObserver((e,a) => {
        const change = e[0].addedNodes.item(0).textContent
        if(change === "Watched" && !viewed) {
            updateContent("turnOff")
            viewed = true
        } else if (change === "Watch") {
            viewed = false
            updateContent("turnOn")
        }
    })
    watchButtonObserver.observe(targetNode,config)
}

function getFriendActivitySection(){
    const friendSection = document.getElementsByClassName("section activity-from-friends -clear -friends-watched -no-friends-want-to-watch")
        .item(0)
    if (friendSection !== null) {
        return friendSection
    } else {
        return document.getElementsByClassName("section activity-from-friends -clear -friends-watched -friends-want-to-watch")
            .item(0)
    }
}

const updateContent = function(message) {
    if(!viewed){
        switch(message) {
            case "turnOff":
                active = false
                document.getElementsByClassName("section ratings-histogram-chart").item(0).style.display = "block"
                if(hideReviews){
                    toggleAllReviews("block")
                }
                if(hideFriends){
                    toggleFriends("block")
                }
                break

            case "turnOn":
                active = true
                document.getElementsByClassName("section ratings-histogram-chart").item(0).style.display = "none"
                if(hideReviews){
                    toggleAllReviews("none")
                }
                if(hideFriends){
                    toggleFriends("none")
                }
                break

            case "showReviews":
                hideReviews = false
                recentReviews.style.display = "block"
                popularReviews.style.display = "block"
                if (!hideFriends){
                    friendReviews.style.display = "block"
                }
                break

            case "hideReviews":
                hideReviews = true
                if(active){
                    toggleAllReviews("none")
                }
                break

            case "showFriends":
                hideFriends = false
                getFriendActivitySection().style.display = "block"
                if (!hideReviews){
                    friendReviews.style.display = "block"
                }
                break

            case "hideFriends":
                hideFriends = true
                if(active){
                    toggleFriends("none")
                }
        }
    }
}



checkActivated()


const targetNode = sideBar
const config = { attributes: true, childList: true, subtree: true }

const sidebarObserver = new MutationObserver(hideElements)
sidebarObserver.observe(targetNode,config)


const reviewsObserver = new MutationObserver(listenReviews)
reviewsObserver.observe(reviews, config)


browser.runtime.onMessage.addListener(updateContent)
