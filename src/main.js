
import { createApp } from 'vue'
import App from './App.vue'
import clusterMeta from '@/utils/clusterMeta.js'
import './style.css'  
const app = createApp(App)


app.config.globalProperties.$clusterMeta = clusterMeta //this line!!!

app.mount('#app')
