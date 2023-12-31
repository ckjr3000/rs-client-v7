import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faChevronDown, faChevronUp, faUpload } from '@fortawesome/free-solid-svg-icons';

library.add(faBars, faUpload, faChevronDown, faChevronUp);

createApp(App)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')