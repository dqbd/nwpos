const fs = require("fs")
const path = require("path")
const exec = require('child_process').exec

let args = process.argv.slice(2)
let target = args.length > 0 ? args[0] : __dirname

exec("python ./loadfont.py", (err, stdout, stderr) => {
    if (err) throw new Error(err)

    let file = fs.readFileSync("display.src.py", "utf-8")
    let matched = file.match(/\r\n|\r|\n/)

    if (matched) {
        let newFile = file.split(matched)
        newFile.splice(1, 0, stdout)
        newFile = newFile.join(matched)

        console.log("Writing at", path.resolve(target, "display.py"))

        fs.writeFileSync(path.resolve(target, "display.py"), newFile, "utf-8")
    } else {
        throw new Error("Failed to match newlines")
    }
})