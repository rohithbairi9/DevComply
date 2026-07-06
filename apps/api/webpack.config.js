const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (options) => {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      // LangChain is distributed as ESM. We need to tell Webpack to handle .mjs and .js files.
      extensions: ['.ts', '.js', '.json', '.mjs'],
      mainFields: ['main', 'module'],
    },
    plugins: [
      ...options.plugins,
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../../node_modules/.prisma/client'),
            to: path.resolve(__dirname, 'dist'),
            globOptions: {
              ignore: ['**/*.js', '**/*.d.ts', '**/*.md'],
            },
          },
        ],
      }),
    ],
  };
};