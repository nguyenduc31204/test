import React, { useEffect, useState } from 'react';
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
} from 'react-icons/lu';
import Header from '../../../components/layouts/Header';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { BASE_URL } from '../../../utils/apiPath';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../../../utils/help';

const SalesOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); 

  const token = localStorage.getItem('access_token');
  const decodedToken = decodeToken(token);
  const userId = decodedToken?.user_id;

  useEffect(() => {
    loadOrdersByUser();
  }, []);

  const loadOrdersByUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/orders/get-order-by-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      const result = await response.json();
      if (result.status_code === 200 && Array.isArray(result.data)) {
        setOrders(result.data);
      } else {
        throw new Error(result.message || 'Invalid orders data format');
      }
    } catch (err) {
      setError(`Failed to load orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/change-status-of-order/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (!response.ok || result.status_code !== 200) {
        throw new Error(result.message || 'Failed to update status');
      }
      loadOrdersByUser();
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  const handleRefresh = () => {
    loadOrdersByUser();
  };

  return (
    <div>
      <Header />
      <DashboardLayout activeMenu="Orders">
        <div className="my-5 mx-auto">
          <div className="content p-20">
            <div className="page-header flex justify-between items-center mb-10">
              <div className="page-title">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Sales Orders Management</h1>
                <div className="breadcrumb text-gray-500 text-sm">
                  <a href="#" className="text-gray-500">Dashboard</a> / My Orders
                </div>
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={() => navigate('/sales/addorder')}
              >
                <i className="fas fa-plus mr-2"></i> Add New Order
              </button>
            </div>

            <div className="stats-row flex flex-wrap gap-4 mb-10">
              <div className="stat-card flex-1 min-w-[200px] rounded-md p-5 m-2 shadow-md bg-white">
                <div className="stat-icon bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <LuCoins className="w-6 h-6" />
                </div>
                <div className="stat-value text-2xl font-bold text-gray-800">{orders.length}</div>
                <div className="stat-label text-gray-500">Total Orders</div>
              </div>
              <div className="stat-card flex-1 min-w-[200px] rounded-md p-5 m-2 shadow-md bg-white">
                <div className="stat-icon bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <LuWalletMinimal className="w-6 h-6" />
                </div>
                <div className="stat-value text-2xl font-bold text-gray-800">
                  {orders.filter((order) => order.status === 'active').length}
                </div>
                <div className="stat-label text-gray-500">Active Orders</div>
              </div>
              <div className="stat-card flex-1 min-w-[200px] rounded-md p-5 m-2 shadow-md bg-white">
                <div className="stat-icon bg-yellow-100 text-yellow-600 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <LuPersonStanding className="w-6 h-6" />
                </div>
                <div className="stat-value text-2xl font-bold text-gray-800">
                  {orders.filter((order) => order.status === 'draft').length}
                </div>
                <div className="stat-label text-gray-500">Draft Orders</div>
              </div>
            </div>

            <div className="card bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="card-header flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">My Orders</h2>
                <div className="tools flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-md">
                    <LuArrowDownToLine className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md">
                    <LuArrowUpNarrowWide className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                    onClick={handleRefresh}
                  >
                    <LuRefreshCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="card-body p-0">
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-400">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {loading && (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 font-semibold text-sm text-blue-500 bg-white shadow rounded-md">
                      Loading orders...
                    </div>
                  </div>
                )}

                {!loading && (
                  <div className="table-responsive overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                              No orders found
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr key={order.order_id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-900">#{order.order_id}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {new Date(order.order_date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{order.customer_name || '-'}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                ${order.total_budget?.toLocaleString() || '0'}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    order.status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : order.status === 'draft'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {order.status === 'draft' ? 'Draft' : order.status || 'unknown'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <button
                                  className="text-blue-600 hover:text-blue-800 mr-2"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  View Details
                                </button>
                                {order.status === 'draft' && (
                                  <>
                                    <button
                                      className="text-yellow-600 hover:text-yellow-800 mr-2"
                                      onClick={() => navigate(`/sales/editorder/${order.order_id}`)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="text-green-600 hover:text-green-800"
                                      onClick={() => updateOrderStatus(order.order_id, 'active')}
                                    >
                                      Activate
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="pagination flex items-center justify-between px-4 py-3 border-t border-gray-200">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to{' '}
                        <span className="font-medium">{orders.length}</span> of{' '}
                        <span className="font-medium">{orders.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <LuChevronsLeft className="w-5 h-5" />
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <LuChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">1</button>
                        <button className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <LuChevronRight className="w-5 h-5" />
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <LuChevronsRight className="w-5 h-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Detail Dialog */}
            {selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-auto">
                  <h2 className="text-xl font-semibold mb-4">Order #{selectedOrder.order_id}</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="font-medium text-gray-700">Order Title:</span>
                      <p className="text-gray-900">{selectedOrder.order_title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Customer Name:</span>
                      <p className="text-gray-900">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Address:</span>
                      <p className="text-gray-900">{selectedOrder.address}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Billing Address:</span>
                      <p className="text-gray-900">{selectedOrder.billing_address}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Order Date:</span>
                      <p className="text-gray-900">{new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedOrder.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : selectedOrder.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {selectedOrder.status === 'draft' ? 'Bản nháp' : selectedOrder.status}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                  <div className="table-responsive overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.details?.map((detail, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 text-sm text-gray-900">{detail.product_id}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{detail.quantity}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">${detail.price_for_customer?.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{detail.service_contract_duration} months</td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              ${(detail.quantity * detail.price_for_customer).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => setSelectedOrder(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default SalesOrders;