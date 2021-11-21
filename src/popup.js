async function switch_on_off() {
    let temp = await browser.storage.local.get("activated")
    const active = temp.activated
    browser.storage.local.set({"activated": !active})
}

async function initializeButton() {
    let temp = await browser.storage.local.get("activated")
    const active = temp.activated

    const styleElement = document.getElementById("on_off_style")
    const optionsButton = document.getElementById("optionsButton")
    if(active) {
        styleElement.firstChild.nodeValue = ".st0{fill:none;stroke:#40BCF4;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;} \n"
            + ".st1{fill:none;stroke:#00E054;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;}"
        optionsButton.title = "Disable Add-On"
    }
    else {
        styleElement.firstChild.nodeValue = ".st0{fill:none;stroke:#808080;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;} \n"
            + ".st1{fill:none;stroke:#FF8000;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;}"
        optionsButton.title = "Enable Add-On"
    }
}


function swtch() {
    switch_on_off()

    const styleElement = document.getElementById("on_off_style")
    const nodeValue = styleElement.firstChild.nodeValue

    // Colour values: Blue=40BCF4, Green=00E054, Orange=FF8000, Grey=808080
    // Switch ring colours
    let nodeText = nodeValue.match(new RegExp(".st0{([a-z]|:|#|[0-9]|[A-Z]|;|-)*}")).entries().next().value[1]

    let front = ".st0{fill:none;stroke:"
    let back = ";stroke-width:6;stroke-linecap:round;stroke-linejoin:round;}"
    let colourValue = nodeText.match(new RegExp("#([A-F]|[0-9])*"))[0]

    const optionsButton = document.getElementById("optionsButton")

    switch(colourValue){
        case "#40BCF4":
            // Add-On is being disabled
            colourValue = "#808080"
            optionsButton.title = "Enable Add-On"
            break
        case "#808080":
            // Add-On is being enabled
            colourValue = "#40BCF4"
            optionsButton.title = "Disable Add-On"
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

    switch(colourValue){
        case "#00E054":
            colourValue = "#FF8000"
            break
        case "#FF8000":
            colourValue = "#00E054"
            break
        default:
            console.log("Unknown Colour Value")
    }

    finalText = finalText + front + colourValue + back

    // Update icon
    styleElement.firstChild.nodeValue = finalText
}


initializeButton()

const eventListener = document.getElementById("optionsButton")
eventListener.addEventListener("click", swtch)

