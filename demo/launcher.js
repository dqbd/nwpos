try {
    const chrome = require("chrome-launch")
    
    chrome("http://localhost:1234", { args: ["--window-size=360,635", "--app=http://localhost:1234"]})
    chrome("http://localhost/", { args: "--window-size=960,680" })
} catch (err) {
    console.log(err)
}
