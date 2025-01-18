import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import './index.css'
import Home from './pages/Homepages/homepage.jsx'
import DashBoard from './pages/DashboardPages/dashboard.jsx'
import Chat from './pages/ChatPages/chatpage.jsx'
import RootLayout from './layout/rootLayout/RootLayout.jsx'
import DashBoardLayout from './layout/dashboardLayout/dashboardLayout.jsx'
import SignInPage from './pages/SignInPage/signin.jsx'
import SignUpPage from './pages/SignUpPage/signup.jsx'

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path:"/sign-in/*",
        element:<SignInPage/>
      },
      {
        path:"/sign-up/*",
        element:<SignUpPage/>
      },
      {
        element: <DashBoardLayout/>,
        children : [
          {
            path:"/dashboard",
            element: <DashBoard/>
          },
          {
            path:"/dashboard/chats/:id",
            element: <Chat/>
          }
        ]
      }
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
