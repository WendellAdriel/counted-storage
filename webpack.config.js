module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'counted-storage.js',
    libraryTarget: 'umd'
  }
}
