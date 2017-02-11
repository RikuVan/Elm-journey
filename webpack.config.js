const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const target = process.env.npm_lifecycle_event

const paths = {
  dist: path.join(__dirname, 'dist'),
  dev: path.join(__dirname, 'dev'),
  src: path.join(__dirname, 'src')
}

const cssLoaders = [
  'style-loader',
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      plugins: function () {
        return [
          require('autoprefixer'),
          require('precss'),
        ];
      }
    }
  },
  'sass-loader'
];

const common = {
  context: paths.src,

  entry: './js',

  output: {
    filename: 'app.js',
  },

  resolve: {
    extensions: ['.js', '.elm', '.scss' ]
  },

  module: {
    rules: [
      {
        test: /\.elm$/,
        exclude: [ /elm-stuff/, /node_modules/ ],
        use: 'elm-webpack-loader'
      },
    ],

    noParse: /\.elm$/
  }
}

if(target === 'bundle') {
  module.exports = merge(common, {
    watch: true,
    devtool: 'inline-source-map',
    output: { path: paths.dev },
    module: {
      rules: [
        {
          test: /.scss$/,
          include: paths.src,
          use: cssLoaders
        }
      ]
    }
  })
}

if(target === 'build') {
  module.exports = merge(common, {
    output: { path: paths.dist },

    plugins: [
      new ExtractTextPlugin({
        filename: 'app.css',
        allChunks: true
      }),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    ],

    module: {
      rules: [
        {
          test: /.sass$/,
          include: paths.src,
          use: ExtractTextPlugin.extract({
            loader: cssLoaders,
            fallback: cssLoaders
          })
        }
      ]
    }
  })
}