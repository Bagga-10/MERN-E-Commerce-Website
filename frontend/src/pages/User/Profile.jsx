import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import placeholder from "../../public/placeholder.png";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { IoIosCamera } from "react-icons/io";

const Profile = () => {
  const fileInputRef = useRef(null);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(placeholder);

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
    if (userInfo.profileImage) {
      setPreview(
        userInfo.profileImage.startsWith("http")
          ? userInfo.profileImage
          : `${import.meta.env.VITE_API_URL || ""}${userInfo.profileImage}`,
      );
    } else {
      setPreview(placeholder);
    }
  }, [userInfo]);



  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const formData = new FormData();
        formData.append("_id", userInfo._id);
        formData.append("username", username);
        formData.append("email", email);
        if (password) formData.append("password", password);
        if (profileImage) formData.append("profileImage", profileImage);

        const res = await updateProfile(formData).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Update Profile</h2>
            <div className="relative mr-4">
              <img
                src={preview}
                alt="Profile"
                className="rounded-full h-32 w-32 object-cover"
              />

              <div
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <IoIosCamera className="h-6 w-6 text-gray-600" />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setProfileImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-400 focus:outline-none"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-400 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-400 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-400 focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-600"
              >
                Update
              </button>

              <Link
                to="/user-orders"
                className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
              >
                My Orders
              </Link>
            </div>

            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
