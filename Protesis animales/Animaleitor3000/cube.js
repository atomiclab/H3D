var jscadModeling = require("@jscad/modeling")
var { booleans, primitives } = jscadModeling;
var { cube, cylinder } = primitives;

function main(params) {
    const { size, radius } = params
    return booleans.substract([
        cube({ size }),
        cylinder({ radius, height: size, center: [50, 0, 0] }
        )
    ])
}

function getParameterDefinitions() {
    return [
        { name: 'size', caption: 'size', type: 'float', initial: 200 },
        { name: 'radius', caption: 'radius', type: 'slider', initial: 50 },
    ]

}
module.exports = { main, getParameterDefinitions }