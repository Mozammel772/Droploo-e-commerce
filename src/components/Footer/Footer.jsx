import { FaFacebook, FaPhoneAlt, FaYoutube } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-orange-50 mt-10">
      <div className="footer max-w-[1400px] mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-base-content ">
        {/* Logo & Contact Info */}
        <div>
            <h1>E-Commerce</h1>
          {/* <img src={} alt="Logo" className="h-12 mb-2" /> */}
          <p className="mb-4 font-bold uppercase text-base">Office Address</p>

          <p className="flex items-center gap-2 mb-1">
            <FaPhoneAlt /> 019111111
          </p>
          <p className="flex items-center gap-2 mb-1">
            <MdEmail /> abc@gmail.com
          </p>
          <p className="flex items-center gap-2">
            <MdLocationOn /> 11/3 Dhaka, Bangladesh
          </p>
        </div>

        {/* Useful Links */}
        <div className="text-base">
          <h2 className="footer-title mb-4 text-base text-black font-bold">Useful Links</h2>
          <Link
            to="/about-us-more-information"
            className="link link-hover block mb-2 text-center md:text-left "
          >
            About Us
          </Link>
          <Link
            to="/contact-us"
            className="link link-hover block mb-2 text-center md:text-left"
          >
            Contact
          </Link>
          <Link
            to="/privacy-policy"
            className="link link-hover block mb-2 text-center md:text-left"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="link link-hover block mb-2 text-center md:text-left"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/refund-policy"
            className="link link-hover block text-center md:text-left"
          >
            Refund Policy
          </Link>
        </div>

        {/* Social Media Links */}
        <div>
          <h2 className="footer-title mb-4 text-base">Follow Us</h2>
          <div className="flex gap-4">
            <a
              href="https://facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-blue-600 text-2xl hover:text-blue-800 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://youtube.com/yourchannel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-red-600 text-2xl hover:text-red-800 transition"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright strip */}
      <div className="border-t border-gray-300 text-center text-sm p-4 bg-base-100">
        <p>
          &copy; {currentYear} Mathematics || Developed by{" "}
          <a
            href="https://www.facebook.com/mozammel.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Mozammel Hosen
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
