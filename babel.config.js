module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]],
    env: {
      production: {
        plugins: ['react-native-paper/babel', 'react-native-reanimated/plugin',],
      },
    },
  };
};
