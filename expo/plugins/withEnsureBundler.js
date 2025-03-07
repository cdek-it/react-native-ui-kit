/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

const { withDangerousMod } = require('@expo/config-plugins')

module.exports = (/** @type import('expo/config').ExpoConfig */ config) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')

      let podfile = fs.readFileSync(podfilePath, 'utf-8')
      if (!podfile.includes('ensure_bundler!')) {
        podfile = `ensure_bundler!\n\n${podfile}`
        fs.writeFileSync(podfilePath, podfile, 'utf-8')
      }

      return config
    },
  ])
}
