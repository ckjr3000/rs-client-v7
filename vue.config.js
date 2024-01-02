module.exports = {
    productionSourceMap: true,
    pwa: {
      name: 'RebelSelves',
      themeColor: '#DE8C01',
      msTileColor: '#FFC0B8',
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black',
      
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
      },
    }
  };