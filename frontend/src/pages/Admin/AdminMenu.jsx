import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed top-5 right-5 z-50 bg-black p-3 rounded-full shadow-md focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <FaTimes size={20} color="white" /> : <FaBars size={20} color="white" />}
      </button>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Sliding Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-[#1f1f1f] text-white z-50 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } shadow-lg`}
      >
        <div className="p-6 text-lg font-semibold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="p-4">
          {[
            { to: "/admin/dashboard", label: "Dashboard" },
            { to: "/admin/categorylist", label: "Create Category" },
            { to: "/admin/productlist", label: "Create Product" },
            { to: "/admin/allproductslist", label: "All Products" },
            { to: "/admin/userlist", label: "Manage Users" },
            { to: "/admin/orderlist", label: "Manage Orders" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 px-3 mb-2 rounded transition-colors ${
                  isActive
                    ? "bg-green-500 text-black font-bold"
                    : "hover:bg-gray-700 text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminMenu;
