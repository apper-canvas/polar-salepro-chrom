import React, { useContext } from "react";
import { useSelector } from 'react-redux';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const Header = ({ onMenuClick, title }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:ml-64">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </button>
          {title && (
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-3 py-1.5 rounded-full border border-primary-200">
              <div className="flex items-center space-x-2">
                <div className="bg-success-500 p-1 rounded-full">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Live Updates</span>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="hidden sm:flex"
          >
            <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
            Settings
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="hidden sm:flex"
          >
            <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
            Logout
          </Button>

          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-lg shadow-lg">
              <ApperIcon name="User" className="h-5 w-5 text-white" />
            </div>
            {user && (
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.emailAddress}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;