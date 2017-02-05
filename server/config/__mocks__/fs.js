const path = require('path')
const fs = jest.genMockFromModule('fs')

let data = Object.create(null)
function __setMockData(mockData) {
    data = Object.assign({}, mockData)
}

function __getMockData() {
    return data
}

function writeFileSync(target, input) {
    data[path.basename(target)] = input
}

function readFileSync(target) {
    return data[path.basename(target)]
}

fs.__setMockData = __setMockData
fs.__getMockData = __getMockData
fs.readFileSync = readFileSync
fs.writeFileSync = writeFileSync

module.exports = fs