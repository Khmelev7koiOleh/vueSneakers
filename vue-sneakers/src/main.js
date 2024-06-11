import './assets/main.css'
import autoAnimate from '@formkit/auto-animate'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(autoAnimatePlugin)
app.mount('#app')
