import { useState, useRef, useEffect } from "react";
import { LuBell, LuSearch, LuUser, LuSettings, LuLogOut } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../features/auth/authSlice";
import logo from "../assets/logo.png"



const Topbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef();
  const {user} = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!profileRef.current?.contains(e.target)) {
        setShowProfileMenu(false);
      }
    
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#1C1F26]  text-white relative">
      <div className="flex items-center gap-2">
        <img src={logo}  className=" w-10 invert-100" alt="" />
        <span className="text-pink-500 font-semibold text-lg">BLADz</span>
      </div>

    

      <div className="flex items-center gap-4">
        

        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img
              src={user?.avatar ? "http://localhost:3000"+user.avatar.replace("public","") : "https://i.pinimg.com/736x/dc/9c/61/dc9c614e3007080a5aff36aebb949474.jpg"}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium">{user.username}</span>
          </div>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
              <div onClick={() =>{ navigate("/settings/profile");setShowProfileMenu(false)}} className="p-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                <LuUser /> Profile
              </div>
              <div onClick={() =>{ navigate("/settings");setShowProfileMenu(false)}} className="p-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                <LuSettings /> Settings
              </div>
              <div onClick={() => {dispatch(logoutUser())}} className="p-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                <LuLogOut /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
