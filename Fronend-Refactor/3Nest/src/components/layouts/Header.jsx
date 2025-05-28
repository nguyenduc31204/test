import React from 'react';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div>
        <img src='../../assets/logo-3nestinvest.png' alt='logo-company'/>  
        <h1 className="text-xl font-semibold text-blue-600">Admin Panel</h1>
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="py-2 px-4 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute right-3 top-2.5 text-gray-400">

        </div>
      </div>
    </header>
  );
};

export default Header;