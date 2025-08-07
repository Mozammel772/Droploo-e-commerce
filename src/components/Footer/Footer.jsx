import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaPhoneAlt, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("https://backend.droploo.com/api/general-data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.message);
        }
        
        setSettings(data.generalData);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch footer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="bg-teal-100 py-8 text-center">
        <div className="max-w-[1400px] mx-auto">Loading footer...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-teal-100 py-8 text-center text-red-500">
        <div className="max-w-[1400px] mx-auto">
          Failed to load footer content. {error && <span>(Error: {error})</span>}
        </div>
      </div>
    );
  }

  return (
    <footer className="bg-teal-100 mt-10">
      <div className="max-w-[1400px] mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Company Info Column */}
        <div className="space-y-4">
          {settings.logo_url && (
            <img 
              src={settings.logo_url} 
              alt="Company Logo" 
              className="h-12 mb-2"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <h2 className="text-xl font-bold text-gray-800">Droploo</h2>
          
          <div className="space-y-2">
            <h3 className="font-semibold uppercase text-gray-700">Contact Us</h3>
            <p className="flex items-center gap-2 text-gray-600">
              <FaPhoneAlt className="text-teal-600" /> 
              {settings.phone || "Not available"}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <MdEmail className="text-teal-600" /> 
              {settings.email || "Not available"}
            </p>
            <p className="flex items-start gap-2 text-gray-600">
              <MdLocationOn className="text-teal-600 mt-1 flex-shrink-0" /> 
              <span>{settings.address || "Address not specified"}</span>
            </p>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h3 className="font-semibold uppercase text-gray-700">Quick Links</h3>
          <nav className="space-y-2">
            <Link
              to="/about-us"
              className="block text-gray-600 hover:text-teal-700 transition"
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              className="block text-gray-600 hover:text-teal-700 transition"
            >
              Contact Us
            </Link>
            <Link
              to="/privacy-policy"
              className="block text-gray-600 hover:text-teal-700 transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="block text-gray-600 hover:text-teal-700 transition"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/refund-policy"
              className="block text-gray-600 hover:text-teal-700 transition"
            >
              Refund Policy
            </Link>
          </nav>
        </div>

        {/* Social & Newsletter Column */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold uppercase text-gray-700 mb-3">Follow Us</h3>
            <div className="flex gap-4">
              {settings.facebook && settings.facebook !== "#" && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-blue-600 hover:text-blue-800 text-2xl transition"
                >
                  <FaFacebook />
                </a>
              )}
              {settings.youtube && settings.youtube !== "#" && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-red-600 hover:text-red-800 text-2xl transition"
                >
                  <FaYoutube />
                </a>
              )}
              {settings.instagram && settings.instagram !== "#" && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-pink-600 hover:text-pink-800 text-2xl transition"
                >
                  <FaInstagram />
                </a>
              )}
              {settings.twitter && settings.twitter !== "#" && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-blue-400 hover:text-blue-600 text-2xl transition"
                >
                  <FaTwitter />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold uppercase text-gray-700">Newsletter</h3>
            <p className="text-gray-600 text-sm">
              Subscribe to get updates on new products and offers
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded-r-md hover:bg-teal-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-200 py-4 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 text-center text-sm  md:text-base text-gray-600">
          <p>
            &copy; {currentYear} Droploo. All rights reserved. | 
            Developed by{" "}
            <a
              href="https://www.facebook.com/mozammel.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline"
            >
              Mozammel Hosen
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;