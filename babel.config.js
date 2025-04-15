module.exports = function (api) {
  api.cache(true);
  const plugins = [
    'react-native-reanimated/plugin', 
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }]
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
