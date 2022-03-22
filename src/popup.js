const COLOUR_VALUE_RING_IS_DISABLED = "#808080"
const COLOUR_VALUE_RING_IS_ENABLED = "#40BCF4"
const COLOUR_VALUE_LINE_IS_DISABLED = "#FF8000"
const COLOUR_VALUE_LINE_IS_ENABLED = "#00E054"


async function switch_on_off_storage() {
    let temp = await browser.storage.local.get("activated")
    const active = temp.activated
    if(active) {
        sendUpdateMessage("turnOff")
    }
    else {
        sendUpdateMessage("turnOn")
    }
    browser.storage.local.set({"activated": !active})
}

async function toggleReviews(){
    let temp = await browser.storage.local.get("hideReviews")
    const hideReviews = temp.hideReviews
    if(hideReviews){
        sendUpdateMessage("showReviews")
    }
    else {
        sendUpdateMessage("hideReviews")
    }
    browser.storage.local.set({"hideReviews": !hideReviews})
}
async function toggleFriends(){
    let temp = await browser.storage.local.get("hideFriends")
    const hideFriends = temp.hideFriends
    if(hideFriends){
        sendUpdateMessage("showFriends")
    }
    else {
        sendUpdateMessage("hideFriends")
    }
    browser.storage.local.set({"hideFriends": !hideFriends})
}

async function initHideReviewsSwitch(){
    let temp = await browser.storage.local.get("hideReviews")
    if (temp.hideReviews) {
        const reviewSwitch = document.getElementById("hideReviews")
        reviewSwitch.checked = true
    }
}

async function initHideFriendsSwitch(){
    let temp = await browser.storage.local.get("hideFriends")
    if (temp.hideFriends) {
        const hideFriends = document.getElementById("hideFriends")
        hideFriends.checked = true
    }
}

async function sendUpdateMessage(updateMessage) {
    const activeTabs = await browser.tabs.query({url: "*://letterboxd.com/film/*"})
    activeTabs.forEach((tab) => {
        browser.tabs.sendMessage(tab.id, updateMessage)
    })
}

async function initializeButton() {
    let temp = await browser.storage.local.get("activated")
    const active = temp.activated

    const styleElement = document.getElementById("on_off_style")
    const enableDisableButton = document.getElementById("enableDisableButton")
    if(active) {
        styleElement.firstChild.nodeValue = ".st0{fill:none;stroke:#40BCF4;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;} \n"
            + ".st1{fill:none;stroke:#00E054;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;}"
        enableDisableButton.title = "Disable Add-On"
    }
    else {
        styleElement.firstChild.nodeValue = ".st0{fill:none;stroke:#808080;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;} \n"
            + ".st1{fill:none;stroke:#FF8000;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;}"
        enableDisableButton.title = "Enable Add-On"
    }
}

function initializePopup(){
    initializeButton()
    initHideReviewsSwitch()
    initHideFriendsSwitch()
}


function swtch() {
    switch_on_off_storage()

    const styleElement = document.getElementById("on_off_style")
    const nodeValue = styleElement.firstChild.nodeValue

    // Colour values: Blue=40BCF4, Green=00E054, Orange=FF8000, Grey=808080

    // Switch ring colours
    let nodeText = nodeValue.match(new RegExp(".st0{([a-z]|:|#|[0-9]|[A-Z]|;|-)*}")).entries().next().value[1]

    let front = ".st0{fill:none;stroke:"
    let back = ";stroke-width:6;stroke-linecap:round;stroke-linejoin:round;}"
    let colourValue = nodeText.match(new RegExp("#([A-F]|[0-9])*"))[0]
    const buttonTitle = document.getElementById("enableDisableButton").title

    const enableDisableButton = document.getElementById("enableDisableButton")

    switch(buttonTitle){
        case "Disable Add-On":
            // Add-On is being disabled
            colourValue = COLOUR_VALUE_RING_IS_DISABLED
            enableDisableButton.title = "Enable Add-On"
            break
        case "Enable Add-On":
            // Add-On is being enabled
            colourValue = COLOUR_VALUE_RING_IS_ENABLED
            enableDisableButton.title = "Disable Add-On"
            break
        default:
            console.log("Unknown Colour Value")
    }

    let finalText = front + colourValue + back + "\n"


    // Switch line colours
    nodeText = nodeValue.match(new RegExp(".st1{([a-z]|:|#|[0-9]|[A-Z]|;|-)*}")).entries().next().value[1]

    front = ".st1{fill:none;stroke:"
    back = ";stroke-width:6;stroke-linecap:round;stroke-linejoin:round;}"
    colourValue = nodeText.match(new RegExp("#([A-F]|[0-9])*"))[0]

    switch(buttonTitle){
        case "Disable Add-On":
            colourValue = COLOUR_VALUE_LINE_IS_DISABLED
            break
        case "Enable Add-On":
            colourValue = COLOUR_VALUE_LINE_IS_ENABLED
            break
        default:
            console.log("Unknown Colour Value")
    }

    finalText = finalText + front + colourValue + back

    // Update icon
    styleElement.firstChild.nodeValue = finalText
}



initializePopup()

const enableDisableListener = document.getElementById("enableDisableButton")
const hideReviewsListener = document.getElementById("hideReviews")
const hideFriendsListener = document.getElementById("hideFriends")
enableDisableListener.addEventListener("click", swtch)
hideReviewsListener.addEventListener("click", toggleReviews)
hideFriendsListener.addEventListener("click", toggleFriends)

