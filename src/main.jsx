import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import { disablePinchZoom } from './utils/disableZoom'
import './index.css'
import router from './routers/router.jsx'

// Chặn zoom (chụm 2 ngón) trên phiên bản mobile
disablePinchZoom();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)