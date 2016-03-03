# grunt-zopfli-native [![Linux Build Status](https://img.shields.io/travis/pierreinglebert/grunt-zopfli-native/master.svg?label=Linux%20build)](https://travis-ci.org/pierreinglebert/grunt-zopfli-native) [![Dependency Status](https://img.shields.io/david/pierreinglebert/grunt-zopfli-native.svg)](https://david-dm.org/pierreinglebert/grunt-zopfli-native) [![devDependency Status](https://img.shields.io/david/dev/pierreinglebert/grunt-zopfli-native.svg)](https://david-dm.org/pierreinglebert/grunt-zopfli-native#info=devDependencies)

Compress your files with zopfli without installing anything.

## Installing

```shell
npm install grunt-zopfli-native --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-zopfli-native');
```

## Using

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### mode `String`

Choose an output format, you can choose between `gzip`, `zlib` or `deflate`. Defaults to gzip.

```js
zopfli({ format: 'zlib' })
 ```

#### extension `String`

Forces an extension to your files. Defaults depends on the mode chosen.

```js
zopfli({ format: 'zlib' })
 ```

#### limit `Number`

Limit on the number of files compressed in parallel. Defaults to the number of CPUs on the host (as per the `os` module).

Setting this limit greater than `UV_THREADPOOL_SIZE` (defaults to 4) won't really work as desired. Increasing `UV_THREADPOOL_SIZE` is a good idea if needed. (e.g. `UV_THREADPOOL_SIZE=10 grunt zopfli`)

```js
zopfli({ limit: 1 })
 ```

#### zopfliOptions `Object`

Options object to pass through to node-zopfli. See [node-zopfli documentation](https://github.com/pierreinglebert/node-zopfli#options) for more information.

```js
{
  verbose: false,
  verbose_more: false,
  numiterations: 15,
  blocksplitting: true,
  blocksplittinglast: false,
  blocksplittingmax: 15
};
```


### Examples

#### Make a gzip file

```js
zopfli: {
  main: {
    files: [{
      src: ['path/*'],
      dest: 'gzipped_files/',
      filter: 'isFile'
    }]
  }
}
```

#### Compress your files for production

```js
zopfli: {
  main: {
    expand: true,
    cwd: 'assets/',
    src: ['**/*'],
    dest: 'public/'
  }
}
```
