import { createBrowserRouter } from "react-router-dom";
import Error from "../components/ErrorPages/Error";
import MainLayout from "../layout/MainLayout";
import Home from "../Pages/HomePages/Home/Home";
import ArrivalProductsDetails from "../Pages/HomePages/NewArrivalProducts/ArrivalProductsDetails";
import TopCategories from "../Pages/HomePages/TopCategory/TopCategory";
import Shop from "../Pages/ShopPages/Shop/Shop";
import ShopDetails from "../Pages/ShopPages/Shop/ShopDetails";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/new-arrival/product/:slug",
        element: <ArrivalProductsDetails />,
      },
      {
        path: "/products-collection",
        element: <Shop />,
      },
      {
        path: "/products-collection",
        element: <TopCategories />,
      },

      {
        path: "/products-collection/:category",
        element: <Shop />,
      },
      {
        path: "/products-collection/:category/:subcategory",
        element: <Shop />,
      },
      {
        path: "/products-collection/details/:slug",
        element: <ShopDetails />,
      },
    ],
  },
]);
