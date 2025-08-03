import React from 'react';
import { createBrowserRouter } from "react-router";
import HomeLayout from "../layout/HomeLayout";
import Errorpage from '../Pages/Errorpage';
import MyProfile from '../Pages/MyProfile';
import PrivateRoute from '../provider/PrivateRoute';
import Updateprof from '../Pages/Updateprof';
import ForgotPage from '../Pages/ForgotPage';
import Register from '../Pages/Register';
import Login from '../Pages/Login';
import AuthLayout from '../layout/AuthLayout';
import Home from '../Pages/Home';


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout></HomeLayout>,
    errorElement: <Errorpage></Errorpage>,
    children: [
      {
        path: '/',
        element: <PrivateRoute><Home></Home></PrivateRoute>,

      },
      {
        path: '/myprofile',
        element: <PrivateRoute><MyProfile></MyProfile></PrivateRoute>,

      },
    ]

  },
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      {
        path: '/auth/login',
        Component: Login,
      },
      {
        path: '/auth/register',
        Component: Register,
      },
      {
        path: '/auth/forget',
        Component: ForgotPage,
      },
      {
        path: '/auth/updateprofile',
        element:
          <Updateprof></Updateprof>
      }
    ]
  }
])

export default router