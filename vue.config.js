module.exports = {
    // configureWebpack: {
    //     resolve: {
    //         alias: {
    //             'vue$': 'vue/dist/vue.esm.js'
    //         }
    //     }
    // }
    outputDir: process.env.VUE_APP_TITLE === 'prod' ? 'prod' : (process.env.VUE_APP_TITLE === 'test') ? 'test' : 'dist',
    publicPath: process.env.NODE_ENV === 'production'? '/' : '/',
}