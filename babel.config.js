module.exports = function (api) {
  api.cache(true);
  const plugins = [
    'react-native-reanimated/plugin', 
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env', 
      safe: false,
      allowUndefined: true,
    }]
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
