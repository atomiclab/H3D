/**
 * Protesis de pierna modular para animales bajo codo
 * @category Other
 * @description Este diseño de pierna contempla a las amputaciones por abajo del codo del perro que la necesite.
 * @tags measurements, bounds, boundingbox
 * @authors Gino Tubaro
 * @licence MIT License
 */

 //include your script here:
//var inc = require('./mypart')

/* All the csg API functions: */
const modeling = require("@jscad/modeling")
//const { color, colorManeToRgb, cssColors, hexToRgb, hslToRgb, hsvToRgb, hueToColorComponant, rgbToHex, rgbToHsl, rgbToHsv } = modeling.color
//const { create, fromPointAxisNormal, transformationBetween } = modeling.connectors // extends, normalize?
//const connectorTransform = modeling.connectors.transform // so as not to overlap with modeling.transforms.transform
//const { geom2, geom3, path2, poly2, poly3 } = modeling.geometry
// geom2   clone,create,fromPoints,isA,reverse,toOutlines,toPoints,toSides,toString,transform
// geom3   clone,create,fromPoints,isA,toPoints,toPolygons,toString,transform
// path2   appendArc,appendBezier,appendPoints,clone,close,concat,create,eachPoint,equals,fromPoints,
//         isA,reverse,toPoints,toString,transform
// poly2   arePointsInside:,create,flip,measureArea
// poly3   clone,create,flip,fromPoints,fromPointsAndPlane,isA,isConvex,measureArea,measureBoundingBox,
//         measureBoundingSphere,measureSignedVolume,toPoints,toString,transform
//const { constants, line2, line3, mat4, plane, utils, vec2, vec3, vec4 } = modeling.math
// line2   clone,closestPoint,create,direction,distanceToPoint,equals,fromPoints,fromValues,
//         intersectPointOfLines,origin,reverse,toString,transform,xAtY
// line3   clone,closestPoint,create,direction,distanceToPoint,equals,fromPlanes,fromPointAndDirection,
//         fromPoints,intersectPointOfLineAndPlane,origin,reverse,toString,transform
// mat4    add,clone,create,equals,fromRotation,fromScaling,fromTaitBryanRotation,fromTranslation,
//         fromValues,fromXRotation,fromYRotation,fromZRotation,identity,isMirroring,
//         mirror,mirrorByPlane,multiply,rightMultiplyVec2,rightMultiplyVec3,rotate,rotateX,rotateY,rotateZ
//         scale,subtract,toString,translate
// plane   clone,create,equals,flip,fromNormalAndPoint,fromValues,fromPoints,fromPointsRandom,
//         signedDistanceToPoint,splitLineSegmentByPlane,toString,transform
// utils   area,clamp,degToRad,intersect,radToDeg,solve2Linear
// vec2    abs,add,angle,angleDegrees,angleRadians,canonicalize,clone,create,cross,distance,divide,
//         dot,equals,fromAngle,fromAngleDegrees,fromAngleRadians,fromArray,fromScalar,fromValues,length,
//         lerp,max,min,multiply,negate,normal,normalize,rotate,scale,squaredDistance,squaredLength,
//         subtract,toString,transform
// vec3    abs,add,angle,canonicalize,clone,create,cross,distance,divide,dot,equals,fromArray,fromScalar,
//         fromValues,fromVec2,length,lerp,max,min,multiply,negate,normalize,random,
//         rotateX,rotateY,rotateZ,scale,squaredDistance,squaredLength,subtract,toString,transform,unit
// vec4    clone,create,fromScalar,fromValues,toString,transform
//const { bezier } = curves
//const { degToRad, radToDeg } = modeling.math.utils
const { arc, circle, cube, cuboid, cylinder, cylinderElliptic, ellipse, ellipsoid, geodesicSphere, 
		line, polygon, polyhedron, rectangle, roundedCuboid, roundedCylinder, roundedRectangle, 
		sphere, square, star, torus } = require('@jscad/modeling').primitives
const { vectorChar, vectorText } = modeling.text
const {areAllShapesTheSameType, flatten, fnNumberSort, insertSorted, interpolateBetween2DPointsForY } = modeling.utils
const { intersect, subtract, union } = modeling.booleans // subtract = difference ?
const { expand, offset } = modeling.expansions
const {extrudeFromSlices, extrudeLinear, extrudeRectangular, extrudeRotate, slice} = modeling.extrusions
const { hull, hullChain } = modeling.hulls
const { measureArea, measureBounds, measureVolume} = modeling.measurements
const { center, centerX, centerY, centerZ, mirror, mirrorX, mirrorY, mirrorZ, 
    rotate, rotateX, rotateY, rotateZ, scale, scaleX, scaleY, scaleZ, 
    translate, translateX, translateY, translateZ} = modeling.transforms

//const { extrudeText } = require('./fonts/index.js')


//const { colorize } = require('@jscad/modeling').colors

////////////////////////////////////////////



const antepie = require('./parts/antepie')
const pie = require('./parts/pie')


const getParameterDefinitions = () => {
  const globalParams = [

    { name: 'group1', type: 'group', caption: 'Datos generales' },

    { name: 'showDer', type: 'checkbox', checked: true, caption: 'Pata delantera derecho' },
    { name: 'showIzq', type: 'checkbox', checked: false, caption: 'Pata delantera izquierda' },
    { name: 'text', type: 'text', initial: '', size: 20, maxLength: 20, caption: 'Nombre del perro:', placeholder: '20 caracteres max' },
    { name: 'email', type: 'email', initial: 'info@atomiclab.org', caption: 'Email:' },

    { name: 'group2', type: 'group', caption: 'Datos de la pata amputada' },

    { name: 'c1', type: 'int', initial: 10, min: 1, max: 100, step: 1, caption: 'Circunferencia superior:' },
    { name: 'c2', type: 'int', initial: 20, min: 1, max: 100, step: 1, caption: 'Circunferencia inferior:' },
    { name: 'l1', type: 'int', initial: 20, min: 1, max: 100, step: 1, caption: 'Largo de la amputacion(abajo del codo):' },

    { name: 'group3', type: 'group', initial: 'closed', caption: 'Datos de la pata completa' },
    { name: 'lp', type: 'int', initial: 20, min: 1, max: 100, step: 1, caption: 'Distancia de la parte ausente (desde muñon al piso):' },
   


  ]

  // Load the parameters defined in the mountPlate sub-file, and add them to the project parameters.
  //const plateParams = mountPlate.getParameterDefinitions()
  globalParams.push()
  return globalParams
  
}


const main = params => {
    console.log(params)
    let results = []

    results = params.showIzq ? results.concat(antepie(params.c1)) : results
    results = params.showDer ? results.concat(pie(params.c1)) : results
  
    return results
  }
  
  module.exports = { main, getParameterDefinitions }
  