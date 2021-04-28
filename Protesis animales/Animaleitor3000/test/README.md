# AtomicPaw

> Jscad prostetic paw for dog, parametric modelling. 

<vuepress-open-jscad design="AtomicPaw.jscad" :panel="{size:223}" :camera="{position: {x: 0, y: 0, z: 223},clip: {min: 1, max: 1000}}"></vuepress-open-jscad>

## Running

The jscad project `AtomicPaw` uses gulp to create a `dist/AtomicPaw.jscad` file and watches your source for changes. You can drag the `dist/AtomicPaw.jscad` directory into the drop area on [openjscad.org](http://openjscad.org). Make sure you check `Auto Reload` and any time you save, gulp creates the `dist/AtomicPaw.jscad` file, and your model should refresh.

### start

`npm start` or `npm run start` will launch gulp, and create `dist/AtomicPaw.jscad` . It also watches for file changes and recreates the dist file.

### clean

Deletes the `dist` directory when you run `npm run clean`.

### inject

Run gulp to combine the source files and inject the dependent libraries with `npm run inject`. Libraries are found using a gulp plugin that looks for a `jscad.json` file in a package. These files are combined and minimized before injecting into the dist file.

### build

Build the [vuepress] static site by running `npm run build`. This script combines the readme with a [vue-openjscad] component to display a live view of the model. The [baseUrl](https://vuepress.vuejs.org/guide/assets.html#base-url) is set with the `BASEPATH` environment variable. It defaults to `/AtomicPaw/`. When hosted on [GitLab], the `.gitlab-ci.yml` CICD file uses this script to publish to [GitLab Pages].

See the [vue-openjscad] package for information on modifying options like the grid or initial camera position.

### serve

Run [vuepress] in dev mode with `npm run serve`. This script watches for file changes and hot reloads changes made to the README file. Changes to the model are not automatically reloaded; a manual reload is required.

## jscad-utils

The example project uses [jscad-utils]. These utilities are a set of utilities that make object creation and alignment easier. To remove it, `npm uninstall --save jscad-utils`, and remove the
`util.init(CSG);` line in `AtomicPaw.jscad`.

## Other libraries

You can search [NPM](https://www.npmjs.com/search?q=jscad) for other jscad libraries. Installing them with NPM and running `gulp` should create a `dist/AtomicPaw.jscad` will all dependencies injected into the file.

For example, to load a [RaspberryPi jscad library] and show a Raspberry Pi Model B, install jscad-raspberrypi using `npm install --save jscad-raspberrypi`. Then return a combined `BPlus` group from the `main()` function.

```javascript
main() {
  util.init(CSG);

  return RaspberryPi.BPlus().combine();
}

// ********************************************************
// Other jscad libraries are injected here.  Do not remove.
// Install jscad libraries using NPM
// ********************************************************
// include:js
// endinject
```

## OpenJSCAD.org

If you publish the `dist/AtomicPaw.jscad` file, you can open it directly in
[openjscad.org](http://openjscad.org) by using the following URL:

<code>
<a href="http://openjscad.org/#">http://openjscad.org/#</a>
</code> + the url to your file.

### Gist

You can save your file to a GitHub [gist](https://gist.github.com/) and append the URL to the raw gist.

For example <http://openjscad.org/#https://gist.githubusercontent.com/johnwebbcole/43f2ef58532a204c694e5ada16888ecd/raw/d0972463f70222e6d4c6c6196a1c759bb3e2362a/snap.jscad>

### Gitlab Snippet

If you save to a gitlab public snippet, you can open it using the following URL:

<https://openjscad.org/#https://gitlab.com/snippets/1795323/raw.jscad>

Make sure you change the snippet id to the correct value and add `.jscad` at the end.

## License

ISC © [Gino Tubaro](http://limbs.earth)

[raspberrypi jscad library]: https://gitlab.com/johnwebbcole/jscad-raspberrypi
[vuepress]: https://vuepress.vuejs.org/
[jscad-utils]: https://www.npmjs.com/package/jscad-utils
[gitlab]: https://gitlab.com/
[gitlab pages]: https://gitlab.com/help/user/project/pages/index.md
[vue-openjscad]: https://gitlab.com/johnwebbcole/vue-openjscad
