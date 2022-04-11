// import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { resolve } from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, { BannerPlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import { COPYRIGHT, ENABLE_ANALYZE, PROJECT_ROOT } from '../utils/constants';
import commonConfig from './webpack.common';

const prodConfig = merge(commonConfig, {
    mode: 'production',
    plugins: [
        new BannerPlugin({
            banner: COPYRIGHT,
            raw: true,
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                memoryLimit: 1024 * 2,
                configFile: resolve(PROJECT_ROOT, 'src/tsconfig.json'),
                profile: ENABLE_ANALYZE,
            },
        }),
        new webpack.ids.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20,
        }),
      //  new AntdDayjsWebpackPlugin(),
        new CssMinimizerPlugin(),
    ],
    optimization: {
        splitChunks: {
            minSize: 20000,
            name:"vendor",
            minChunks:1,
            cacheGroups: {
                vendor: { // 项目基本框架等
                    test: /[/\\]node_modules[/\\](react|react-dom|antd)[/\\]/,
                    name: 'vendor',
                    priority: 100,
                    chunks: 'all',
                },
            
            },
           
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions:{
                    compress:{
                        drop_console:true
                    }
                }
                
            }),
        ],
    },
});

if (ENABLE_ANALYZE) {
    prodConfig.plugins!.push(new BundleAnalyzerPlugin());
}

export default prodConfig;
