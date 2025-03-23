// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path')

const withStorybook = require('@storybook/react-native/metro/withStorybook')
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

module.exports = withStorybook(config, {
  enabled: true,
  configPath: path.resolve(__dirname, './.storybook'),
})
