import { Outlet } from "react-router";

import { Flip, ToastContainer } from "react-toastify";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <main className="flex-grow bg-teal-50">
        <div className="mt-16 md:mt-32 py-2 ">
          <Outlet />
          <ToastContainer
            position="top-center"
            autoClose={1200}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Flip}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
