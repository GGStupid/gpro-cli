const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync

module.exports = function (metadata, src, dest) {
  if (!src) {
    return Promise.reject(new Error(`无效的source:${src}`))
  }
  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .source(src)
      .destination(dest)
      .clean(false)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata().ans
        Object.keys(files).forEach(fileName => {
          if (fileName === 'package.json') {
            const t = files[fileName].contents.toString()
            files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
          }
        })
        done()
      }).build(err => {
        rm(src)
        err ? reject(err) : resolve(metadata)
      })
  })
}
