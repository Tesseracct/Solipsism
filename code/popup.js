let hideRatings = false
browser.storage.local.set({"hideRatings": hideRatings})

async function getValue() {
    let temp = await browser.storage.local.get("hideRatings")
    console.log(temp.hideRatings)
}

getValue()
