// using fonts from https://github.com/lautr3k/jscad-vector-fonts
const { vectorText } = require('@jscad/modeling').text
const { extrudeRectangular } = require('@jscad/modeling').extrusions
const { union } = require('@jscad/modeling').booleans

const extrudeText = (text, fontWidth, extrudeHeight, font={}) => {
    if(font.hasOwnProperty('font') && typeof font.font == 'string') {
        require("./" + font.font.replace(/Font?/g, ".js"))
        font.font = eval(font.font)
    }
    let segments = vectorText( { font: font.font }, text );
    let output = [];
    segments.forEach(segment => output.push(
        extrudeRectangular(segment, { size:fontWidth, height:extrudeHeight, segments: 16})
    ));
    return union(output);
}

module.exports = { extrudeText }
