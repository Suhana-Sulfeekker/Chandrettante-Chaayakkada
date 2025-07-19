import React, { useState, useEffect } from 'react';
import './OwnerDashboard.css';
import axios from 'axios';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('setMenu');

  const [mealCount, setMealCount] = useState(200);
  const [mealPrice, setMealPrice] = useState(40);
  const [chaiPrice, setChaiPrice] = useState(10);
  const [snacks, setSnacks] = useState([{ name: '', price: '', count: '' }]);

  const [allOrders, setAllOrders] = useState([]);

  const handleSnackChange = (index, field, value) => {
    const updatedSnacks = [...snacks];
    updatedSnacks[index][field] = value;
    setSnacks(updatedSnacks);
  };

  const addSnack = () => {
    setSnacks([...snacks, { name: '', price: '', count: '' }]);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        mealCount,
        mealPrice,
        chaiPrice,
        snacks: snacks.filter(s => s.name.trim() !== '')
      };
      console.log("Backend base URL:", process.env.REACT_APP_BACKEND_BASE_URL);
      await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/owner/set-menu`, payload);

      alert("Menu updated successfully ✅");
    } catch (err) {
      console.error("Error setting menu:", err);
      alert("Failed to update menu ❌");
    }
  };

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/order/all`);
      const today = new Date().toISOString().split("T")[0];
      const filtered = res.data.orders.filter(
        (order) => order.placedAt?.startsWith(today) && !order.completed
      );
      setAllOrders(filtered);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const markCompleted = async (orderId) => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/order/mark-completed/${orderId}`);
      fetchAllOrders();
    } catch (err) {
      console.error("Error marking order completed:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'viewOrders') {
      fetchAllOrders();
    }
  }, [activeTab]);

  return (
    <div className="owner-dashboard">
      <nav className="nav-bar">
        <button className={activeTab === 'setMenu' ? 'active' : ''} onClick={() => setActiveTab('setMenu')}>Set Menu</button>
        <button className={activeTab === 'viewOrders' ? 'active' : ''} onClick={() => setActiveTab('viewOrders')}>View Orders</button>
      </nav>

      {activeTab === 'setMenu' && (
        <div className="menu-form">
          <h2>Set Today's Menu</h2>

          <label>Meals Available:</label>
          <input type="number" value={mealCount} onChange={(e) => setMealCount(e.target.value)} />

          <label>Meal Price (₹):</label>
          <input type="number" value={mealPrice} onChange={(e) => setMealPrice(e.target.value)} />

          <label>Chai Price (₹):</label>
          <input type="number" value={chaiPrice} onChange={(e) => setChaiPrice(e.target.value)} />

          <h3>Snacks</h3>
          {snacks.map((snack, index) => (
            <div key={index} className="snack-row">
              <input
                type="text"
                placeholder="Snack Name"
                value={snack.name}
                onChange={(e) => handleSnackChange(index, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                value={snack.price}
                onChange={(e) => handleSnackChange(index, 'price', e.target.value)}
              />
              <input
                type="number"
                placeholder="Count"
                value={snack.count}
                onChange={(e) => handleSnackChange(index, 'count', e.target.value)}
              />
            </div>
          ))}
          <button className="add-snack-btn" onClick={addSnack}>+ Add Snack</button>

          <button className="submit-btn" onClick={handleSubmit}>Save Menu</button>
        </div>
      )}

      {activeTab === 'viewOrders' && (
        <div className="view-orders">
          <h2>Today's Pending Orders</h2>
          {allOrders.length === 0 ? (
            <p>No orders yet today.</p>
          ) : (
            allOrders.map((order) => (
              <div key={order.orderId} className="order-card">
                <p><strong>User:</strong> {order.name} ({order.email})</p>
                <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>{item.name} — {item.quantity} x ₹{item.price}</li>
                  ))}
                </ul>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                <button onClick={() => markCompleted(order.orderId)}>Mark as Completed</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
