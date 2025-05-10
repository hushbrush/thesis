
import { createApp } from 'vue'
import App from './App.vue'
import clusterMeta from '@/utils/clusterMeta.js'
import './style.css'  
const app = createApp(App)

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap';
document.head.appendChild(link);
app.config.globalProperties.$clusterMeta = clusterMeta 
app.config.devtools = false
app.mount('#app')
