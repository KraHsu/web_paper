import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import appendJS from './utils/appendJS.js'
import {get, post} from './utils/http/api'
import './assets/styles/global.styl';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.mount('#app')

app.config.globalProperties.$appendJS = appendJS
app.config.globalProperties.$post = post
app.config.globalProperties.$get = get