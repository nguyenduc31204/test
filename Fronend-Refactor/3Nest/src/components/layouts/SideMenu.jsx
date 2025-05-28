import React, { useContext } from 'react'
// import { UserContext } from '../../context/userContext'
import { useNavigate } from "react-router-dom"
import { SIDE_MENU_DATA } from '../../utils/data'

const SideMenu = ({activeMenu}) => {
//   const { user, clearUser } = useContext(UserContext)

  const navigate = useNavigate();

  const handleClick = (route) => {
    if(route === "Logout") {
      handleLogout();
      return;
    }

    navigate(route)
    
  }
  const handleLogout = () => {
    localStorage.clear();
    // clearUser();
    navigate("/login");
  };

  return (
  <div className="w-full h-full bg-white shadow-md rounded-lg p-6">
    {/* <div className="flex flex-col items-center mb-6">
      {user?.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-primary"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-white mb-3 text-xl">
          ?
        </div>
      )}
      <h5 className="text-lg font-semibold text-gray-800">
        {user?.fullName || "Người dùng"}
      </h5>
    </div> */}

    <div className="space-y-2">
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          onClick={() => handleClick(item.path)}
          className={`w-full flex items-center gap-4 text-[15px] 
            ${
              activeMenu === item.label
                ? "text-white bg-primary"
                : "text-gray-700 hover:bg-gray-100"
            } 
            py-3 px-4 rounded-lg transition duration-200`}
        >
          {item.icon && <item.icon className="text-xl" />}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  </div>
);
} 
export default SideMenu
