let config={
    copyfile:[
        'src/components',
        'src/pages',
        'src/router',
        'src/store',
        'src/style',
        'src/utils',
        'src/App.vue',
        'src/App.vue',
        'public/index.html',
        '.eslintrc.js',
        'babel.config.js',
        'config.js',
        'vue.config.js'
    ],
    inject:{
        'src/main.js':'inject/main.js'
    },
    delFile:[
        'src/components',
        'src/views',
        'src/assets',
        'src/router.js',
        'src/store.js',
        'src/components',
    ],
    yarn:{
        'devDependencies':[ //开发依赖
            'compression-webpack-plugin',
            'node-sass',
        ],
        'dependencies':[
            'vuex-persistedstate',
            'ycloud-ui',
            'v-contextmenu',
        ]
    }

}

module.exports =config;