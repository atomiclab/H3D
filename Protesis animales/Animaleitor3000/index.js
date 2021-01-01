//include your script here:
var inc = require('./mypart')


const getParameterDefinitions = () => {
    return inc.getParameterDefinitions()
}

const main = (params) => {
    return inc.main(params)
}

module.exports = { main, getParameterDefinitions }
