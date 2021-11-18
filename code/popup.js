async function getActivated() {
    let temp = await browser.storage.local.get("activated")
    const active = temp.activated
    browser.storage.local.set({"activated": !active})
}

getActivated()
