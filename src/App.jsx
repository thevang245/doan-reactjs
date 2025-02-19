import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./Component/Layout"
import Home from "./Component/Pages/Home/Home"
import Shop from "./Component/Pages/Shop/Shop"
import ShopDetail from "./Component/Pages/ShopDetail/ShopDetail"
import Error from "./Component/Pages/Error/Error"
import Apartment from "./Component/Pages/Shop/Apartment"
import House from "./Component/Pages/Shop/House"
import SearchResult from "./Component/Pages/Shop/SearchResult"
import Signin from "./auth/Signin"
import Signup from "./auth/Signup"
import Favourite from "./Component/Pages/Favourite/Favourite"


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    errorElement: <Error/>,
    children: [
      {
        index: true,
        element: <Home/>,
      },
      {
        path: '/posts',
        element: <Shop/>, //// Danh sach san pham
      },
      {
        path: '/apartments',
        element: <Apartment/>, //// Danh sach san pham
      },
      {
        path: '/houses',
        element: <House/>, //// Danh sach san pham
      },
      {
        path: '/search',
        element: <SearchResult/>, //// Danh sach san pham
      },
      {
        path: '/product-detail/:id',
        element: <ShopDetail/>, //// Chi tiet san pham
      },
      {
        path: '/saved-posts',
        element: <Favourite/>, //// Gio hang
      },
      {
        path: '/sign-in',
        element: <Signin/>
      },
      {
        path: '/sign-up',
        element: <Signup/>
      }
      
      
     
    ]
  }
  
 
 
])
function App() {

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
