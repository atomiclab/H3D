/*
// title       : Modular Project Design Example
// author      : Moissette Mark, Simon Clark
// license     : MIT License
// description : Demonstrating the structure of a multi-file project
// file        : sphereShape.js
// tags        : project, module, code, files, subfolder
*/

const { sphere, star, cylinderElliptic} = require('@jscad/modeling').primitives
const { colorize } = require('@jscad/modeling').colors
const { translateZ } = require('@jscad/modeling').transforms

const sphereShape = (radius) => {
  
console.log("asASDASDASd");

let star2 = star({vertices: 12, outerRadius: 40, innerRadius: 20}) // star with given radius
let myshape = cylinderElliptic({height: 20, startRadius: [10,3], endRadius: [8,3]})

  return star2,myshape;

}
module.exports = sphereShape




