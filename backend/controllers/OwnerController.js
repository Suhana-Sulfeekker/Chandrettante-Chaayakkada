const { db } = require('../firebase');

exports.setMenu = async (req, res) => {
  try {
    const menuData = req.body;
    console.log("Received payload:", menuData); // 🔍 This must show in terminal

    // Save to Firestore
    await db.collection('menus').doc('latest').set({
      ...menuData,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({ success: true, message: 'Menu saved successfully' });
  } catch (error) {
    console.error("Error saving menu:", error);
    res.status(500).json({ success: false, message: 'Failed to save menu' });
  }
};

exports.getMenu = async (req, res) => {
  try {
    console.log('🔄 [GET_MENU] Fetching latest menu from Firestore...');

    const doc = await db.collection('menus').doc('latest').get();

    if (!doc.exists) {
      console.warn('⚠️ [GET_MENU] No menu found in Firestore!');
      return res.status(404).json({ success: false, message: 'No menu found' });
    }

    const menuData = doc.data();
    console.log('✅ [GET_MENU] Menu fetched successfully:', JSON.stringify(menuData, null, 2));

    res.status(200).json({ success: true, menu: menuData });
  } catch (error) {
    console.error("❌ [GET_MENU] Error fetching menu:", error);
    res.status(500).json({ success: false, message: 'Failed to get menu' });
  }
};

// POST /api/order/mark-completed/:orderId
exports.markOrderCompleted = async (req, res) => {
  const { orderId } = req.params;
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: 'completed' });

    console.log(`[UPDATE] Order marked completed — ID: ${orderId}`);
    return res.status(200).json({ success: true, message: 'Order marked as completed' });
  } catch (err) {
    console.error(`[ERROR] Marking order completed — ID: ${orderId}`, err.message);
    return res.status(500).json({ success: false, error: 'Server error marking order completed' });
  }
};

// GET /api/order/all
exports.getAllOrders = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'orders'));
    const orders = [];

    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    console.log(`[GET] Fetched all orders — Count: ${orders.length}`);
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error(`[ERROR] Fetching all orders:`, err.message);
    return res.status(500).json({ success: false, error: 'Server error fetching orders' });
  }
};