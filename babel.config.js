module.exports = (api) => {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-unistyles/plugin',
        {
          root: 'src',
          autoProcessImports: [
            '../utils',
            '../../utils',
            '../../../utils',
            '../../../../utils',
          ],
        },
      ],
      '@babel/plugin-transform-class-static-block',
    ],
  }
}
