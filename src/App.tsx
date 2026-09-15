import { RouterProvider } from "react-router";
import router from "@/router/routes";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router}></RouterProvider>
        <Toaster />
      </Provider>
    </>
  );
}

export default App;
