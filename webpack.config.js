
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require('glob');
var packCSS = new ExtractTextPlugin({
    filename: '[name].min.css', 
    allChunks: false
}); 



var path = require('path');
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');


var htmlPlugins = [
    // new webpack.optimize.UglifyJsPlugin({
    //   minimize: true,
    //   compress: {
    //     warnings: false // 去除代码块内的告警语句
    //   }
    // }),
    packCSS,
    new webpack.optimize.CommonsChunkPlugin('vendors'),
    require('autoprefixer')
    // ,new webpack.DefinePlugin({
    //  'process.env': {
     //     NODE_ENV: '"production"'
     // }
    // })

];

var entries = {
  vendors: ['./app/component/js/jquery-2.0.3.min.js']
};//入口
var files = glob.sync('./app/!(component)/index.js');
files.forEach(function(f){
  var name = f.split('/index.js')[0];
  var dirNameArr = name.split('/');
  var dName = dirNameArr[dirNameArr.length - 1];

  entries[dName] = f;


  const htmlPlugin = new HtmlWebpackPlugin({
    filename: ROOT_PATH + `/public/${dName}.html`,
    template: 'html-withimg-loader!' + ROOT_PATH + `/app/${dName}/index.html`,
    chunks: [dName, 'vendors']
  });
  htmlPlugins.push(htmlPlugin);

});


module.exports = {
  devtool: false,
  entry:  entries,
  output: {
    path: path.join(ROOT_PATH + "/public"),//打包后的文件存放的地方
    filename: "js/[name].bundle.js"
  },

  module: {//在配置文件里添加JSON loader
    loaders: [
      {
        test: /\.json$/,
        loader: "json-loader"//不能只写json,json文件不能有注释
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          //加载css-loader、postcss-loader（编译顺序从下往上）转译css
            use: [
                {
                    loader : 'css-loader'
                }//,
                // {
                //     loader : 'postcss-loader',
                //     //配置参数;
                //     options: {
                //         //从postcss插件autoprefixer 添加css3前缀;
                //       plugins: function() {
                //           return [
                //               //加载autoprefixer并配置前缀,可加载更多postcss插件;
                //               require('autoprefixer')({
                //                   browsers: ['ios >= 7.0']
                //               })
                //           ];
                //       }
                //   }
                // }
            ]
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'//在webpack的module部分的loaders里进行配置即可
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
      },
      {
        test: /\.(woff|eot|ttf)\??.*$/,
        loader: 'url-loader?name=css/font/[hash:8].[name].[ext]'
      }
    ]
  },

  plugins: htmlPlugins,

  devServer: {
    contentBase: "./public",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true,//实时刷新
    port: 8099,
    compress: true
  }


}
//注：“__dirname”是Node.js中的一个全局变量，它指向当前执行脚本所在的目录。