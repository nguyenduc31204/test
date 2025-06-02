import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Header from '../../../components/layouts/Header';
import { decodeToken } from '../../../utils/help';
import { BASE_URL } from '../../../utils/apiPath';
import {
  LuChevronsLeft,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsRight,
  LuArrowDownToLine,
  LuArrowUpNarrowWide,
  LuRefreshCcw,
} from 'react-icons/lu';
import AddOrderDialog from './AddOrderDialog';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const SalesAddOrder = () => {
  const navigate = useNavigate();
  const { order_id } = useParams();
  const [activeRole, setActiveRole] = useState('sales');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [existingDetails, setExistingDetails] = useState([]);
  const [createdOrderId, setCreatedOrderId] = useState(
    order_id ? Number(order_id) : localStorage.getItem('createdOrderId') || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      order_title: '',
      customer_name: '',
      address: '',
      billing_address: '',
    },
  });

  const formValues = watch();

  // Fetch user, products, orders, and order details
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser(decodeToken(token));
    } else {
      setError('No authentication token found');
    }

    const loadProductsByTypeAndRole = async () => {
      try {
        const response = await fetch(`${BASE_URL}/products/get-products-by-role`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const result = await response.json();
        if (result.status_code !== 200 || !Array.isArray(result.data)) {
          throw new Error(result.message || 'Invalid product data');
        }
        setProducts(result.data);
      } catch (err) {
        setError(`Failed to load products: ${err.message}`);
      }
    };

    const loadAllOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/orders/get-order-by-user`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const result = await response.json();
        if (result.status_code === 200 && Array.isArray(result.data)) {
          setAllOrders(result.data);
        } else {
          throw new Error(result.message || 'Failed to load orders');
        }
      } catch (err) {
        setError(`Failed to load orders: ${err.message}`);
      }
    };

    const loadOrderDetails = async () => {
      if (order_id || createdOrderId) {
        const idToUse = order_id ? Number(order_id) : createdOrderId;
        try {
          const response = await fetch(`${BASE_URL}/orders/get-order-details-by-order?order_id=${idToUse}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'ngrok-skip-browser-warning': 'true',
            },
          });
          const result = await response.json();
          if (result.status_code === 200 && Array.isArray(result.data)) {
            setExistingDetails(result.data);
          } else {
            throw new Error(result.message || 'Failed to load order details');
          }
        } catch (err) {
          setError(`Failed to load order details: ${err.message}`);
        }
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadProductsByTypeAndRole(), loadAllOrders(), loadOrderDetails()]);
      setLoading(false);
    };

    loadData();
  }, [activeRole, order_id, createdOrderId]);

  // Load order for editing based on order_id
  useEffect(() => {
    if (order_id || createdOrderId) {
      const idToUse = order_id ? Number(order_id) : createdOrderId;
      const matchedOrder = allOrders.find(order => order.order_id === idToUse);
      if (matchedOrder) {
        setOrderData(matchedOrder);
        setValue('order_title', matchedOrder.order_title || '');
        setValue('customer_name', matchedOrder.customer_name || '');
        setValue('address', matchedOrder.address || '');
        setValue('billing_address', matchedOrder.billing_address || '');
      } else if (allOrders.length > 0) {
        setError(`Order with ID ${idToUse} not found`);
      }
    }
  }, [order_id, createdOrderId, allOrders, setValue]);

  const handleSaveOrder = async () => {
    try {
      const orderIdToUse = order_id ? Number(order_id) : createdOrderId;
      let response;
      const updatedData = {
        order_id: orderIdToUse,
        order_title: formValues.order_title || '',
        order_status: 'draft',
        customer_name: formValues.customer_name || '',
        address: formValues.address || '',
        billing_address: formValues.billing_address || '',
      };

      if (orderIdToUse) {
        response = await fetch(`${BASE_URL}/orders/update-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify(updatedData),
        });
      } else {
        response = await fetch(`${BASE_URL}/orders/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify(updatedData),
        });
      }

      const result = await response.json();
      if (!response.ok || result.status_code !== 200) {
        throw new Error(result.message || 'Failed to save order');
      }

      if (!orderIdToUse) {
        const newOrderId = result.data.order_id || result.data.id;
        if (newOrderId) {
          setCreatedOrderId(newOrderId);
          localStorage.setItem('createdOrderId', newOrderId);
        }
      }

      // Refresh orders list
      const ordersResponse = await fetch(`${BASE_URL}/orders/get-order`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const ordersResult = await ordersResponse.json();
      if (ordersResult.status_code === 200 && Array.isArray(ordersResult.data)) {
        setAllOrders(ordersResult.data);
      }

      reset();
      setOrderData(null);
      setExistingDetails([]);
      setCreatedOrderId(null);
      localStorage.removeItem('createdOrderId');
      navigate('/sales/orders');
    } catch (err) {
      setError(`Failed to save order: ${err.message}`);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      const orderIdToUse = order_id ? Number(order_id) : createdOrderId;
      let response;
      const updatedData = {
        order_id: orderIdToUse,
        order_title: formValues.order_title || '',
        order_status: 'active',
        customer_name: formValues.customer_name || '',
        address: formValues.address || '',
        billing_address: formValues.billing_address || '',
      };

      if (orderIdToUse) {
        response = await fetch(`${BASE_URL}/orders/update-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify(updatedData),
        });
      } else {
        response = await fetch(`${BASE_URL}/orders/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify(updatedData),
        });
      }

      const result = await response.json();
      if (!response.ok || result.status_code !== 200) {
        throw new Error(result.message || 'Failed to submit order');
      }

      if (!orderIdToUse) {
        const newOrderId = result.data.order_id || result.data.id;
        if (newOrderId) {
          setCreatedOrderId(newOrderId);
          localStorage.setItem('createdOrderId', newOrderId);
        }
      }

      // Refresh orders list
      const ordersResponse = await fetch(`${BASE_URL}/orders/get-order`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const ordersResult = await ordersResponse.json();
      if (ordersResult.status_code === 200 && Array.isArray(ordersResult.data)) {
        setAllOrders(ordersResult.data);
      }

      reset();
      setOrderData(null);
      setExistingDetails([]);
      setCreatedOrderId(null);
      localStorage.removeItem('createdOrderId');
      navigate('/sales/orders');
    } catch (err) {
      setError(`Failed to submit order: ${err.message}`);
    }
  };

  const handleAddOrderClick = () => {
    handleSubmit(() => setIsDialogOpen(true))();
  };

  const handleDialogSubmit = (data) => {
    const updatedDetails = [...existingDetails];
    data.details.forEach((newDetail) => {
      const existingIndex = updatedDetails.findIndex(
        (d) => d.product_id === newDetail.product_id
      );
      if (existingIndex >= 0) {
        updatedDetails[existingIndex].quantity += newDetail.quantity;
      } else {
        updatedDetails.push(newDetail);
      }
    });
    setExistingDetails(updatedDetails);
    setOrderData({ ...data, details: updatedDetails });
    setIsDialogOpen(false);
  };

  const handleRoleChange = (newRole) => {
    setActiveRole(newRole);
  };

  const handleRefresh = () => {
    setLoading(true);
    setProducts([]);
    setAllOrders([]);
    setExistingDetails([]);
    setError(null);

    const loadData = async () => {
      try {
        const productsResponse = await fetch(`${BASE_URL}/products/get-products-by-role`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const productsResult = await productsResponse.json();
        if (productsResult.status_code === 200 && Array.isArray(productsResult.data)) {
          setProducts(productsResult.data);
        }

        const ordersResponse = await fetch(`${BASE_URL}/orders/get-order`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const ordersResult = await ordersResponse.json();
        if (ordersResult.status_code === 200 && Array.isArray(ordersResult.data)) {
          setAllOrders(ordersResult.data);
        }

        if (order_id || createdOrderId) {
          const idToUse = order_id ? Number(order_id) : createdOrderId;
          const detailsResponse = await fetch(`${BASE_URL}/orders/get-order-details-by-order?order_id=${idToUse}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'ngrok-skip-browser-warning': 'true',
            },
          });
          const detailsResult = await detailsResponse.json();
          if (detailsResult.status_code === 200 && Array.isArray(detailsResult.data)) {
            setExistingDetails(detailsResult.data);
          }
        }
      } catch (err) {
        setError(`Failed to refresh data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  };

  const getOrderItemsForDisplay = () => {
    const orderItems = [];
    let itemIndex = 1;

    const idToUse = order_id ? Number(order_id) : createdOrderId;
    const matchedOrder = allOrders.find(order => order.order_id === idToUse);

    if (existingDetails.length > 0 && matchedOrder) {
      existingDetails.forEach((detail) => {
        const product = products.find(p => p.product_id === detail.product_id);
        orderItems.push({
          no: itemIndex++,
          // name: matchedOrder.order_title || '-',
          name: detail.product_name || product?.name || '-',
          sku: detail.sku_partnumber || product?.sku || '-',
          salesOrChannel: matchedOrder.customer_name || '-',
          quantity: detail.quantity || 0,
          serviceYear: detail.service_contract_duration || 0,
          subtotal: detail.price_for_customer && detail.quantity
            ? (detail.price_for_customer * detail.quantity).toFixed(2)
            : 0,
          status: matchedOrder.status || 'pending',
        });
      });
    }

    return orderItems;
  };

  const orderItems = getOrderItemsForDisplay();

  return (
    <div>
      <Header />
      <DashboardLayout activeMenu="Orders">
        <div className="my-5 mx-auto">
          <div className="content p-20">
            <div className="page-header flex justify-between items-center mb-10">
              <div className="page-title">
                <h1 className="text-2xl font-semibold mb-2">Order Details</h1>
                <div className="breadcrumb text-gray-500 text-sm">
                  <a href="#" className="text-gray-500">Dashboard</a> / Order
                </div>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={handleAddOrderClick}
                >
                  <i className="fas fa-plus mr-2"></i> Add Item
                </button>
              </div>
            </div>

            <div className="product-role flex space-x-2 bg-gray-50 p-4">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeRole === 'sales'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                onClick={() => handleRoleChange('sales')}
              >
                Sales
              </button>
            </div>

            {activeRole === 'sales' && (
              <div className="flex justify-center">
                <div className="w-full max-w-5xl">
                  <h1 className="text-2xl font-semibold mb-6">Order Sales</h1>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username Sales</label>
                        <p className="text-base text-gray-800">{user?.user_name || '--'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-base text-gray-800">{user?.user_email || '--'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <p className="text-base text-gray-800">{user?.phone || '--'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name Company</label>
                        <p className="text-base text-gray-800">{user?.company_name || '--'}</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Order Title</label>
                        <input
                          {...register('order_title', { required: 'Order title is required' })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="Enter order title"
                        />
                        {errors.order_title && (
                          <p className="text-red-600 text-sm mt-1">{errors.order_title.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <input
                          {...register('customer_name', { required: 'Customer name is required' })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="Enter customer name"
                        />
                        {errors.customer_name && (
                          <p className="text-red-600 text-sm mt-1">{errors.customer_name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          {...register('address', { required: 'Address is required' })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="Enter address"
                        />
                        {errors.address && (
                          <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Billing Address</label>
                        <input
                          {...register('billing_address', { required: 'Billing address is required' })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="Enter billing address"
                        />
                        {errors.billing_address && (
                          <p className="text-red-600 text-sm mt-1">{errors.billing_address.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Order Details</h3>
                    {existingDetails.length === 0 ? (
                      <p className="text-gray-500 text-sm">No products added yet.</p>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract Duration</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {existingDetails.map((detail, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 text-sm text-gray-900">{detail.product_name || 'Unknown'}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{detail.quantity}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                ${(detail.price_for_customer || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{detail.service_contract_duration} months</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={handleSubmit(handleSaveOrder)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                      disabled={existingDetails.length === 0}
                    >
                      Save as Draft
                    </button>
                    <button
                      onClick={handleSubmit(handleSubmitOrder)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                      disabled={existingDetails.length === 0}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeRole === 'channels' && (
              <div className="flex justify-center mt-8">
                <div className="w-full max-w-5xl">
                  <h1 className="text-2xl font-semibold mb-6">Order Channels</h1>
                  <p className="text-gray-600">Channel distribution details...</p>
                </div>
              </div>
            )}

            <div className="card bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="card-header flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {activeRole === 'sales' ? 'Sales' : 'Channel'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Year</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orderItems.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                              No orders found
                            </td>
                          </tr>
                        ) : (
                          orderItems.map((item, index) => (
                            <tr key={`order-item-${index}`} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-900">{item.no}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.sku}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.salesOrChannel}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.serviceYear}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                ${Number(item.subtotal).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  item.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : item.status === 'draft'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.status}
                                </span>
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
                        <span className="font-medium">{orderItems.length}</span> of{' '}
                        <span className="font-medium">{orderItems.length}</span> results
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

            <AddOrderDialog
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleDialogSubmit}
              activeRole={activeRole}
              order_title={formValues.order_title}
              customer_name={formValues.customer_name}
              address={formValues.address}
              billing_address={formValues.billing_address}
              existingDetails={existingDetails}
            />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default SalesAddOrder;