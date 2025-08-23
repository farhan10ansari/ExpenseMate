module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          'react-compiler': {
            sources: filename => {
              // Match file names to include in the React Compiler.
              return filename.includes('src/path/to/dir');
            },
          },
        },
      ],
    ],
    plugins: [["inline-import", { "extensions": [".sql"] }]],
    env: {
      production: {
        plugins: ['react-native-paper/babel', 'react-native-reanimated/plugin',],
      },
    },
  };
};
