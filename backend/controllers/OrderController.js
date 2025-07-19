const { db } = require('../firebase');

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const {
      orderId,
      email,
      name,
      uid,
      items,
      totalAmount
    } = req.body;

    console.log('➡️ Received order payload:', req.body);

    const orderPayload = {
      orderId,
      email,
      name,
      uid,
      items,
      totalAmount,
      placedAt: new Date().toISOString()
    };

    // Step 1: Fetch current menu from Firestore
    const menuRef = db.collection('menus').doc('latest');
    const menuDoc = await menuRef.get();

    if (!menuDoc.exists) {
      console.error('❌ Menu document not found in Firestore');
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }

    const currentMenu = menuDoc.data();
    console.log('✅ Current menu fetched from DB:', currentMenu);

    // Step 2: Validate item availability
    const updatedMenu = { ...currentMenu };

    for (const item of items) {
      const { name: itemName, quantity } = item;

      if (itemName.toLowerCase() === 'chai') {
        console.log(`🫖 Skipping chai count check (unlimited): ${item.quantity}`);
        continue;
      }

      if (itemName === 'Meal') {
        const mealCount = parseInt(updatedMenu.mealCount);
        if (quantity > mealCount) {
          console.warn(`❌ Not enough meals. Requested: ${quantity}, Available: ${mealCount}`);
          return res.status(400).json({
            success: false,
            message: `Not enough Meals. Only ${mealCount} left.`
          });
        }
        updatedMenu.mealCount = mealCount - quantity;
        console.log(`🍛 Meal count updated: ${updatedMenu.mealCount}`);
      } else {
        const snack = updatedMenu.snacks.find(snack => snack.name === itemName);
        if (!snack) {
          console.warn(`❌ Snack not found: ${itemName}`);
          return res.status(400).json({ success: false, message: `Item ${itemName} not found in menu` });
        }

        const currentCount = parseInt(snack.count);
        if (quantity > currentCount) {
          console.warn(`❌ Not enough ${itemName}. Requested: ${quantity}, Available: ${currentCount}`);
          return res.status(400).json({
            success: false,
            message: `Not enough ${itemName}. Only ${currentCount} left.`
          });
        }

        snack.count = String(currentCount - quantity);
        console.log(`🥟 ${itemName} count updated: ${snack.count}`);
      }
    }

    // Step 3: Update menu counts in DB
    await menuRef.set(updatedMenu);
    console.log('✅ Updated menu saved to Firestore');

    // Step 4: Save order to Firestore
    await db.collection('orders').doc(orderId).set(orderPayload);
    console.log(`✅ Order saved with ID: ${orderId}`);

    res.status(200).json({ success: true, message: 'Order placed successfully' });

  } catch (err) {
    console.error('🔥 Error placing order:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE ORDER BY orderId
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(`🗑️ Deleting order with ID: ${orderId}`);

    await db.collection('orders').doc(orderId).delete();
    res.status(200).json({ success: true, message: 'Order deleted successfully' });

  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};

// GET ALL ORDERS BY UID
exports.getOrdersByUser = async (req, res) => {
  try {
    const { uid } = req.params;
    console.log(`📥 Fetching orders for UID: ${uid}`);

    const snapshot = await db.collection('orders')
      .where('uid', '==', uid)
      .orderBy('placedAt', 'desc')
      .get();

    const orders = snapshot.docs.map(doc => doc.data());
    console.log(`📦 Found ${orders.length} orders for user`);

    res.status(200).json({ success: true, orders });

  } catch (error) {
    console.error("❌ Error fetching orders by user:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// MARK ORDER AS COMPLETED
exports.markOrderCompleted = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(`✅ Marking order as completed: ${orderId}`);

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      console.warn(`❌ Order not found: ${orderId}`);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await orderRef.update({ completed: true });
    console.log(`✅ Order ${orderId} marked as completed`);

    res.status(200).json({ success: true, message: 'Order marked as completed' });
  } catch (err) {
    console.error('🔥 Error marking order as completed:', err);
    res.status(500).json({ success: false, message: 'Failed to mark order as completed' });
  }
};

// GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    console.log(`📋 Fetching all orders...`);

    const snapshot = await db.collection('orders')
      .orderBy('placedAt', 'desc')
      .get();

    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`📦 Found ${orders.length} orders`);

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('🔥 Error fetching all orders:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};
