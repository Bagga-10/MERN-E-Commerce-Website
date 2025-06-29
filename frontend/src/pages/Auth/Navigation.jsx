import { useEffect, useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import { setFavorites } from "../../redux/features/favorites/favoriteSlice";
import placeholder from "../../public/placeholder.png";
import { resetCart } from "../../redux/features/cart/cartSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [preview, setPreview] = useState(placeholder);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // New: Close dropdown when sidebar shrinks
  const handleSidebarMouseLeave = () => {
    setDropdownOpen(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      dispatch(setFavorites([]));
      dispatch(resetCart());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.profileImage) {
      setPreview(
        userInfo.profileImage.startsWith("http")
          ? userInfo.profileImage
          : `${import.meta.env.VITE_API_URL || ""}${userInfo.profileImage}`
      );
    } else {
      setPreview(placeholder);
    }
  }, [userInfo]);

  return (
    <div
      style={{ zIndex: 999 }}
      className={`${showSidebar ? "hidden" : "flex"}
      xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-3 text-white bg-black w-[4%]
      hover:w-[15%] h-[100vh] fixed group`}
      id="navigation-container"
      onMouseLeave={handleSidebarMouseLeave} // <-- Add this
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[1.5rem]" size={26} />
          <span className="hidden nav-item-name mt-[1.5rem]">HOME</span>
        </Link>

        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[1.5rem]" size={26} />
          <span className="hidden nav-item-name mt-[1.5rem]">SHOP</span>
        </Link>

        {userInfo && (
          <Link
            to="/cart"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineShoppingCart className="mr-2 mt-[1.5rem]" size={26} />
            <span className="hidden nav-item-name mt-[1.5rem]">CART</span>
            <div className="absolute top-2 left-4">
              {cartItems.length > 0 && (
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((acc, c) => acc + c.qty, 0)}
                </span>
              )}
            </div>
          </Link>
        )}

        {userInfo && (
          <Link
            to="/favorite"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <FaHeart className="mr-2 mt-[1.5rem]" size={26} />
            <span className="hidden nav-item-name mt-[1.5rem]">FAVORITE</span>
            <FavoritesCount />
          </Link>
        )}
      </div>

      <div className="relative">
        {userInfo && (
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center mb-10 focus:outline-none"
          >
            <img
              src={preview}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover border-2 border-white hover:ring-2 hover:ring-pink-400 transition"
            />
            <span className="ml-3 text-xl text-white hidden nav-item-name">
              {userInfo.username}
            </span>
          </button>
        )}

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute left-2 right-0 mr-14 w-48 rounded-md shadow-lg border border-gray-200 bg-white text-gray-700 z-50 ${
              !userInfo.isAdmin ? "-top-[7rem]" : "-top-[19rem]"
            } space-y-1`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-400">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full text-left px-4 py-2 hover:bg-gray-400"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      {!userInfo && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin
                className="mr-2 mt-[1.5rem] mb-[1.5rem]"
                size={26}
              />
              <span className="hidden nav-item-name mt-[1.5rem] mb-[1.5rem]">
                LOGIN
              </span>
            </Link>
          </li>
          <Link
            to="/register"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineUserAdd
              className="mr-2 mt-[1.5rem] mb-[1.5rem]"
              size={26}
            />
            <span className="hidden nav-item-name mt-[1.5rem] mb-[1.5rem]">
              REGISTER
            </span>
          </Link>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
