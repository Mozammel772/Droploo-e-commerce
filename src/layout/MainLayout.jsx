import { Outlet } from "react-router";

import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";



const MainLayout = () => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <main className="flex-grow bg-teal-50">
        <div className="mt-2 py-2 ">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
