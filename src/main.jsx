import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { routes } from "./Routes/Routes.jsx";
const queryClient = new QueryClient();


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes}></RouterProvider>
    </QueryClientProvider>
  </StrictMode>
);
