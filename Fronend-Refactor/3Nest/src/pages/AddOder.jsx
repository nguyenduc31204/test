import React, { useEffect, useState } from 'react'
import {
    LuCoins,
    LuWalletMinimal,
    LuPersonStanding,
    LuChevronsLeft,
    LuChevronLeft,
    LuChevronRight,
    LuChevronsRight,
    LuArrowDownToLine,
    LuArrowUpNarrowWide,
    LuRefreshCcw,
    LuX
} from "react-icons/lu"

import Header from '../components/layouts/Header'
import DasboardLayout from '../components/layouts/DashboardLayout'
import { API_PATHS, BASE_URL } from '../utils/apiPath'
import { useNavigate } from 'react-router-dom'

const AddOrder = () => {
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const role = localStorage.getItem('role');
    const [activeRole, setActiveRole] = useState(role || 'admin');
    const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
    const openAddOrder = () => setIsAddOrderOpen(true);
    const closeAddOrder = () => setIsAddOrderOpen(false);

    const [newOrder, setNewOrder] = useState({
        title: '',
        userName: '',
        companyName: '',
        customerName: '',
        totalBudget: '',
        status: true 
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusChange = (e) => {
        setNewOrder(prev => ({
            ...prev,
            status: e.target.value === 'true'
        }));
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        try {
            // Here you would typically make an API call to submit the order
            console.log('Submitting order:', newOrder);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // On success:
            alert('Order added successfully!');
            closeAddOrder();
            // Reset form
            setNewOrder({
                title: '',
                userName: '',
                companyName: '',
                customerName: '',
                totalBudget: '',
                status: true
            });
            // Refresh orders list
            handleRefresh();
        } catch (err) {
            console.error('Error submitting order:', err);
            setError('Failed to add order');
        }
    };

    // ... rest of your existing useEffect and other functions ...

    return (
        <div>
            <Header />
            <DasboardLayout activeMenu="Orders">
                <div className='my-5 mx-auto'>
                    <div className="content p-20">
                        {/* ... your existing header and stats code ... */}

                        {/* Add Order Modal */}
                        {isAddOrderOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                                    <div className="flex justify-between items-center border-b p-4">
                                        <h3 className="text-lg font-semibold">Add New Order</h3>
                                        <button 
                                            onClick={closeAddOrder}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <LuX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <form onSubmit={handleSubmitOrder} className="p-4">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                                Order Title*
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={newOrder.title}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                                                User Name*
                                            </label>
                                            <input
                                                type="text"
                                                id="userName"
                                                name="userName"
                                                value={newOrder.userName}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyName">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                id="companyName"
                                                name="companyName"
                                                value={newOrder.companyName}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
                                                Customer Name*
                                            </label>
                                            <input
                                                type="text"
                                                id="customerName"
                                                name="customerName"
                                                value={newOrder.customerName}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalBudget">
                                                Total Budget*
                                            </label>
                                            <input
                                                type="number"
                                                id="totalBudget"
                                                name="totalBudget"
                                                value={newOrder.totalBudget}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                                min="0"
                                            />
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Status*
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value="true"
                                                        checked={newOrder.status === true}
                                                        onChange={handleStatusChange}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2">Active</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value="false"
                                                        checked={newOrder.status === false}
                                                        onChange={handleStatusChange}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2">Inactive</span>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-end space-x-3 pt-4 border-t">
                                            <button
                                                type="button"
                                                onClick={closeAddOrder}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Add Order
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* ... rest of your existing table and pagination code ... */}
                    </div>
                </div>
            </DasboardLayout>
        </div>
    )
}

export default AddOrder