// const eet = jest.genMockFromModule('eet')
module.exports = (options, items) => {
    module.exports.__calls.push({options, items})
    return Promise.resolve({})
}

module.exports.__calls = []