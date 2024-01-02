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
            src: 'img/icons/android-chrome-72x72.png'
          },
          {
            src: 'img/icons/apple-touch-icon.png'
          },
          {
            src: 'img/icons/favicon-16x16.png'
          },
          {
            src: 'img/icons/favicon-32x32.png'
          },
          {
            src: 'img/icons/mstile-150x150.png'
          },
          {
            src: 'img/icons/safari-pinned-tab.svg'
          },
        ]       
      },
  
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
      },
    }
  };