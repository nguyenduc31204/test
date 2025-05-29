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
