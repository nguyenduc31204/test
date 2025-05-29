import { useState } from "react";
import DasboardLayout from "../../../components/layouts/DashboardLayout"
import Header from "../../../components/layouts/Header"


const AddOder = () => {
  const [activeRole, setActiveRole] = useState('admin');
  

    const handleRoleChange = (newRole) => {
      setActiveRole(newRole);
    };

  return (
    <div>
      <Header />
      <DasboardLayout activeMenu="Orders">
        <div className='my-5 mx-auto'>
          <div className="content p-20">
            <div className="page-header flex justify-between items-center mb-10">
                <div class="page-title">
                  <h1 className='text-2xl font-semibold bg-#181c32 mb-2'>Order Details</h1>
                  <div className="breadcrumb text-gray-500 text-sm hover:text-slate-500">
                      <a href="#" className='text-gray-500 '>Dashboard</a> / Order
                  </div>
                </div>
                <div className="action-buttons mb-2">
                  <button class="btn btn-primary" onclick="openModal()">
                      <i class="fas fa-plus"></i> Add new item
                  </button>
                </div>
            </div>
            


          <div className="product-role flex space-x-2 bg-gray-50 p-4">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeRole === 'admin'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => handleRoleChange('admin')}
            >
              Admin
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeRole === 'sales'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => handleRoleChange('sales')}
            >
              Sales
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeRole === 'channels'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => handleRoleChange('channels')}
            >
              Channels
            </button>
          </div>

          {activeRole === 'sales' && (
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <h1 className="text-2xl font-semibold mb-6">Order Sales</h1>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter contact number"
                      />
                    </div>
                  </div>

                  {/* cột 2 */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Address</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter contact address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Billing Address</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter billing address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRole === 'channels' && (
            <div className="flex justify-center mt-8">
              <div className="w-full max-w-5xl">
                <h1 className="text-2xl font-semibold mb-6">Order Channels</h1>
                <p className="text-gray-600">kênh phân phối...</p>
              </div>
            </div>
          )}


          </div>
        </div>
      </DasboardLayout>

    </div>
  )
}

export default AddOder
