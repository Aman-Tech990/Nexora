import { createBrowserRouter, RouterProvider } from "react-router";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MainLayout from "./layouts/MainLayout";
import Home from "./components/Home";

function App() {

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/profile",
          element: <Home />
        },
      ]
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/login",
      element: <Login />
    }
  ]);

  return (
    <RouterProvider router={appRouter} />
  )
}

export default App;
