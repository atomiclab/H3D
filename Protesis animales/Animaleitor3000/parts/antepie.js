/*
// title       : Modular Project Design Example
// author      : Moissette Mark, Simon Clark
// license     : MIT License
// description : Demonstrating the structure of a multi-file project
// file        : sphereShape.js
// tags        : project, module, code, files, subfolder
*/

const { sphere } = require('@jscad/modeling').primitives
const { colorize } = require('@jscad/modeling').colors
const { translateZ } = require('@jscad/modeling').transforms

const sphereShape = (radius) => {
  
console.log("asASDASDASd");

 
  return colorize([0,10, 1, 1], translateZ(radius, sphere({ radius })))
}

module.exports = sphereShape

