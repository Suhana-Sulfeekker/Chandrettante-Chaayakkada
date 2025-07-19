// src/pages/UserDashboard.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./UserDashboard.css";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

const UserDashboard = () => {
  const [menu, setMenu] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchMenu = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/owner/get-menu`
      );
      setMenu(res.data.menu);
    } catch (err) {
      console.error("Failed to fetch menu", err);
    }
  };

  const fetchUserOrders = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/order/get-by-user/${user.uid}`
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch user orders", err);
    }
  }, [user]);

  useEffect(() => {
    fetchMenu();
    fetchUserOrders();
  }, [fetchUserOrders]);

  const handleChange = (e, itemKey) => {
    const value = parseInt(e.target.value || "0");
    const updatedItems = { ...selectedItems, [itemKey]: value };
    setSelectedItems(updatedItems);

    let total = 0;
    if (menu) {
      total += (updatedItems.meal || 0) * parseInt(menu.mealPrice);
      total += (updatedItems.chai || 0) * parseInt(menu.chaiPrice);
      menu.snacks.forEach((snack, index) => {
        const snackKey = `snack-${index}`;
        total += (updatedItems[snackKey] || 0) * parseInt(snack.price);
      });
    }
    setTotalAmount(total);
  };

  const placeOrder = async () => {
    try {
      const items = [];

      if (selectedItems.meal > 0) {
        items.push({
          name: "Meal",
          price: parseInt(menu.mealPrice),
          quantity: selectedItems.meal,
        });
      }

      if (selectedItems.chai > 0) {
        items.push({
          name: "Chai",
          price: parseInt(menu.chaiPrice),
          quantity: selectedItems.chai,
        });
      }

      menu.snacks.forEach((snack, index) => {
        const key = `snack-${index}`;
        const qty = selectedItems[key] || 0;
        if (qty > 0) {
          items.push({
            name: snack.name,
            price: parseInt(snack.price),
            quantity: qty,
          });
        }
      });

      if (items.length === 0) {
        alert("Please select at least one item.");
        return;
      }

      const payload = {
        orderId: uuidv4(),
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        items,
        totalAmount,
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/order/place`,
        payload
      );
      alert("Order placed successfully!");
      setSelectedItems({});
      setTotalAmount(0);
      fetchUserOrders();
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Failed to place order");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/order/delete/${orderId}`
      );
      alert("Order deleted");
      fetchUserOrders();
    } catch (err) {
      console.error("Failed to delete order", err);
      alert("Failed to delete order");
    }
  };

  if (!menu) return <div>Loading...</div>;

  return (
    <div className="user-dashboard">
      <h1>Menu</h1>
      <div className="menu-section">
        <div className="menu-item">
          <span>
            Meal (₹{menu.mealPrice}) - Available: {menu.mealCount}
          </span>
          <input
            type="number"
            min="0"
            max={menu.mealCount}
            value={selectedItems.meal || ""}
            onChange={(e) => handleChange(e, "meal")}
          />
        </div>
        <div className="menu-item">
          <span>Chai (₹{menu.chaiPrice}) - Unlimited</span>
          <input
            type="number"
            min="0"
            value={selectedItems.chai || ""}
            onChange={(e) => handleChange(e, "chai")}
          />
        </div>
        {menu.snacks.map((snack, index) => (
          <div key={index} className="menu-item">
            <span>
              {snack.name} (₹{snack.price}) - Available: {snack.count}
            </span>
            <input
              type="number"
              min="0"
              max={snack.count}
              value={selectedItems[`snack-${index}`] || ""}
              onChange={(e) => handleChange(e, `snack-${index}`)}
            />
          </div>
        ))}
        <div className="total">Total: ₹{totalAmount}</div>
        <button onClick={placeOrder}>Place Order</button>
      </div>

      <h2>Your Orders</h2>
      <div className="orders-section">
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id || order.orderId} className="order-item">
              <div className="order-summary">
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} — Qty: {item.quantity} @ ₹{item.price}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total:</strong> ₹{order.totalAmount}
                </p>
                <p>
                  <strong>Placed At:</strong>{" "}
                  {new Date(order.placedAt).toLocaleString()}
                </p>
              </div>

              <button onClick={() => deleteOrder(order.id || order.orderId)}>
                Delete Order
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
