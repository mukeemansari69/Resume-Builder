import { createBrowserRouter, Navigate } from "react-router"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
 

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "/register",
        element: <Register />
    },
    {   
        path: "/login",
        element: <Login />
    },
    {
        path: "/",
        element: <h1>Home Page</h1>
    }
])
