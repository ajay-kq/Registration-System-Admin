const express = require('express');
const router = express.Router();
const { Template, TemplateVersion } = require('../models/Template');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

// @desc    Get all templates
// @route   GET /api/v1/templates
router.get('/', authorize(['templates.read', 'Admin', 'Sales Staff']), async (req, res) => {
    try {
        const templates = await Template.find();
        res.status(200).json({ success: true, data: templates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Create template
// @route   POST /api/v1/templates
router.post('/', authorize(['templates.create', 'Admin']), async (req, res) => {
    try {
        const template = await Template.create({ ...req.body, created_by: req.user._id });
        res.status(201).json({ success: true, data: template });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Update template (creates version history)
// @route   PUT /api/v1/templates/:id
router.put('/:id', authorize(['templates.update', 'Admin']), async (req, res) => {
    try {
        const { content } = req.body;
        let template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        // Save previous version
        await TemplateVersion.create({
            template_id: template._id,
            old_content: template.content,
            version: template.version,
            modified_by: req.user._id
        });

        // Update to new version
        template.content = content;
        template.version += 1;
        template.updated_at = Date.now();

        const updatedTemplate = await template.save();
        res.status(200).json({ success: true, data: updatedTemplate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
