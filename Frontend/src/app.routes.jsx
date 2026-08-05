import { createBrowserRouter, Navigate } from "react-router"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
import Home from "./features/interview/pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        )
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
        path: "/home",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        )
    }
])
