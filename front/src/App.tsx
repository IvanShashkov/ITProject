import {RouterProvider} from "react-router-dom"
import {Provider} from "react-redux"
import {SnackbarProvider} from "notistack"

import store from "@/store/store.ts"
import router from "@/router"

function App() {
  return (
      <SnackbarProvider
          autoHideDuration={4000}
          anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
          }}
      >
          <Provider store={store}>
              <RouterProvider router={router}/>
          </Provider>
      </SnackbarProvider>
  )
}

export default App
