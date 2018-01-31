#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const inquirer = require('inquirer')
const latestVersion = require('latest-version')
const download = require('../lib/download')

program.usage('<project-name>').parse(process.argv)

let projectName = program.args[0]
if (!projectName) {
  return program.help()
}

const list = glob.sync('*')
let next = undefined
let rootName = path.basename(process.cwd())
if (list.length) {
  if (list.filter(name => {
    const fileName = path.resolve(process.cwd(), path.join('.', name))
    const isDir = fs.statSync(fileName).isDirectory()
    return name.indexOf(projectName) !== -1 && isDir
  }).length !== 0) {
    return console.log(`项目${projectName}已经存在`)
  }
  rootName = Promise.resolve(projectName)
} else if (rootName === projectName) {
  next = inquirer.prompt([
    {
      name: 'buildInCurrent',
      message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目',
      type: 'confir',
      default: true
    }
  ]).then(ans => {
    return Promise.resolve(ans.buildInCurrent ? '.' : projectName)
  })
} else {
  next = Promise.resolve(projectName)
}
next && go()

function go () {
  next.then(projectRoot => {
    if (projectRoot !== '.') {
      fs.mkdirSync(projectRoot)
    }
  })
  return download(projectRoot).then(target => {
    return {
      name: projectRoot,
      root: projectRoot,
      downloadTemp: target
    }
  }).then(context => {
    return inquirer.prompt([
      {
        name: 'projectName',
        message: '项目名称',
        default: context.name
      },
      {
        name: 'projectVersion',
        message: '项目版本号',
        default: '1.0.0'
      },
      {
        name: 'projectDescription',
        message: '项目介绍',
        default: `A project named ${context.name}`
      }
    ]).then(ans => {
      return latestVersion('pro-ui').then(version => {
        ans.supportUiVersion = version
        return {
          ...context,
          metadata: {
            ...ans
          }
        }
      }).catch(err => {
        return Promise.reject(err)
      })
    })
  }).then(context => {
    console.log(context)
  }).catch(err => {
    console.log(err)
  })
}