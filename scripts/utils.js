const path = require('path')
const fs = require('fs')

const WORKSPACE_DIR = path.resolve(__dirname, '../packages')

const getSubPackage = () => {
  const dirs = fs.readdirSync(WORKSPACE_DIR)
  return dirs.reduce((collection, dir) => {
    return collection.concat(`${WORKSPACE_DIR}/${dir}/package.json`)
  }, [])
}

const getSubPackageNames = () => {
  return getSubPackage().reduce((collection, p) => {
    const pck = require(p)
    return collection.concat(pck.name)
  }, [])
}

module.exports = {
  getSubPackage,
  getSubPackageNames,
}
