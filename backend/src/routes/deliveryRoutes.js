const express = require('express');
const router = express.Router();
const { Delivery, DeliveryStatusHistory } = require('../models/Delivery');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

// @desc    Update Delivery Status
// @route   PUT /api/v1/deliveries/:id/status
router.put('/:id/status', authorize(['deliveries.update', 'Delivery Staff', 'Admin']), async (req, res) => {
    try {
        const { status, tracking_number } = req.body;
        let delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({ success: false, message: 'Delivery not found' });
        }

        // Save history
        await DeliveryStatusHistory.create({
            delivery_id: delivery._id,
            previous_status: delivery.delivery_status,
            new_status: status,
            updated_by: req.user._id
        });

        delivery.delivery_status = status;
        if (tracking_number) delivery.tracking_number = tracking_number;

        const updatedDelivery = await delivery.save();
        res.status(200).json({ success: true, data: updatedDelivery });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
