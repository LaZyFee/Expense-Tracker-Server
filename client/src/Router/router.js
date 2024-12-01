import Main from "../Layouts/Main";
import Login from "../Pages/UserAuthenticationPages/Login";
import SignUp from "../Pages/UserAuthenticationPages/SignUp";
import ForgetPassword from "../Pages/UserAuthenticationPages/ForgetPassword";
import ResetPassword from "../Pages/UserAuthenticationPages/ResetPassword";
import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Shared/Home";
import InputEntry from "../Pages/InputEntry";
import Statics from "../Pages/Statics";
import NotFound from "../Pages/Shared/NotFound";
import PrivateRoute from "./PrivateRoute";
import UserProfile from "../Pages/Shared/UserProfile";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoute />,  // Wrap Main component with PrivateRoute
        children: [
            {
                path: "/",
                element: <Main />,
                children: [
                    { path: "/", element: <Home /> },
                    { path: "/expense", element: <InputEntry /> },
                    { path: "/statics", element: <Statics /> },
                    { path: "/profile", element: <UserProfile /> },
                ],
            },
        ],
    },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/forgot-password", element: <ForgetPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "*", element: <NotFound /> },
]);
