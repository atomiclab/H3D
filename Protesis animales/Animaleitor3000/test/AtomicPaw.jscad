// title      : atomicPaw
// author     : Gino Tubaro
// license    : ISC License
// file       : atomicPaw.jscad

/* exported main, getParameterDefinitions */

function getParameterDefinitions() {
  /**
   * Add the keys to the `Parts` object
   * here and they will be listed in the
   * parameters.
   */
  var ENABLED = {
    example1: true,
    example2: false
  };

  return [
    { type: 'group', name: 'Parts' },
    ...Object.keys(ENABLED).map((name) => {
      return {
        name,
        type: 'checkbox',
        checked: ENABLED[name]
      };
    }),
    {
      name: 'resolution',
      type: 'choice',
      values: [0, 1, 2, 3, 4],
      captions: [
        'low (8,24)',
        'normal (12,32)',
        'high (24,64)',
        'very high (48,128)',
        'ultra high (96,256)'
      ],
      default: 0,
      initial: 0,
      caption: 'Resolution:'
    },
    { type: 'group', name: 'View' },
    {
      name: 'center',
      type: 'checkbox',
      checked: false
    },
    { type: 'group', name: 'Cutaway' },
    {
      name: 'cutawayEnable',
      caption: 'Enable:',
      type: 'checkbox',
      checked: false
    },
    {
      name: 'cutawayAxis',
      type: 'choice',
      values: ['x', 'y', 'z'],
      initial: 'y',
      caption: 'Axis:'
    }
  ];
}
function main(params) {
  var start = performance.now();
  var resolutions = [
    [6, 16],
    [8, 24],
    [12, 32],
    [24, 64],
    [48, 128]
  ];
  var [defaultResolution3D, defaultResolution2D] = resolutions[
    parseInt(params.resolution)
  ];
  CSG.defaultResolution3D = defaultResolution3D;
  CSG.defaultResolution2D = defaultResolution2D;
  util.init(CSG);

  /**
   * The `Parts` object needs to contain
   * the values from the `ENALBED` object.
   */
  var Parts = {
    example1: () => example1(),
    example2: () => example2()
  };

  var selectedParts = Object.entries(Parts)
    .filter(([key, value]) => {
      return params[key];
    })
    .reduce((parts, [key, value]) => {
      var part = value();
      if (Array.isArray(part)) parts = parts.concat(part);
      else parts.push(part);
      return parts;
    }, []);

  console.log('selectedParts', selectedParts);
  var parts = selectedParts.length ? selectedParts : [util.unitAxis(20)];

  if (params.center) parts = [union(parts).Center()];
  if (params.cutawayEnable)
    parts = [util.bisect(union(parts), params.cutawayAxis).parts.positive];

  console.log('timer', performance.now() - start);

  /**
   * If you are using @jwc/jscad-hardware and want
   * a Bill Of Materials (BOM), uncomment this and
   * open the DevTools console to see the BOM
   * list.
   */
  // console.log(
  //   'BOM\n',
  //   Object.entries(Hardware.BOM)
  //     .map(([key, value]) => `${key}: ${value}`)
  //     .join('\n')
  // );

  console.log('parts', ...parts);

  return [...parts];
}

function example1() {
  var box1 = Parts.Cube([10, 10, 10]).fillet(1, 'z+').color('orange');

  var box2 = Parts.Cube([5, 5, 5])
    .snap(box1, 'z', 'outside-')
    .align(box1, 'xy');

  var cyl1 = Parts.Cylinder(5, 10)
    .chamfer(2, 'z+')
    .rotateX(90)
    .snap(box2, 'y', 'outside+')
    .align(box2, 'xz')
    .color('green');
  return box1
    .union([box2.fillet(-1, 'z-').color('blue'), cyl1])
    .translate([0, 10, 0]);
}

function example2() {
  var box1 = Parts.Cube([10, 10, 10]).fillet(1, 'z+').color('orange');

  return box1
    .center()
    .wedge(30, -30, 'x')
    .map((part, name) => {
      if (name == 'wedge') return part.translate([0, 5, 0]);
      return part;
    })
    .combine()
    .translate([0, -10, 0]);
}

// ********************************************************
// Other jscad libraries are injected here.  Do not remove.
// Install jscad libraries using NPM
// ********************************************************
// include:js
// endinject
