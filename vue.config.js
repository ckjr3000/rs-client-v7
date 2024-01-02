module.exports = {
    productionSourceMap: true,
    pwa: {
      name: 'RebelSelves',
      themeColor: '#DE8C01',
      msTileColor: '#FFC0B8',
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black',
      
      manifestOptions: {
        icons: [
          {
            src: '../public/img/icons/android-chrome-72x72.png'
          }
        ]       
      },
  
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
      },
    }
  };