import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "react-datepicker/dist/react-datepicker.css";
import "@/utils/datepicker-styles.css";

import axios from 'axios'
import { URL_BACK } from './config/index'

axios.defaults.baseURL = URL_BACK

createRoot(document.getElementById('root')!).render(
    <App />
)
