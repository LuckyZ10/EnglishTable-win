const express = require('express');
const router = express.Router();
const Config = require('../models/Config');

// 获取配置
router.get('/', async (req, res) => {
  try {
    let config = await Config.findOne();
    // 如果没有配置记录，创建默认配置
    if (!config) {
      config = new Config();
      await config.save();
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 更新配置 - PATCH方法
router.patch('/', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
    }

    // 更新配置字段
    if (req.body.userRole != null) config.userRole = req.body.userRole;
    if (req.body.theme != null) config.theme = req.body.theme;
    if (req.body.provider != null) config.provider = req.body.provider;
    if (req.body.key != null) config.key = req.body.key;
    if (req.body.deepseekModelType != null) config.deepseekModelType = req.body.deepseekModelType;

    const updatedConfig = await config.save();
    res.json(updatedConfig);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 保存配置 - POST方法（用于前端兼容性）
router.post('/', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
    }

    // 更新配置字段
    if (req.body.userRole != null) config.userRole = req.body.userRole;
    if (req.body.theme != null) config.theme = req.body.theme;
    if (req.body.provider != null) config.provider = req.body.provider;
    if (req.body.key != null) config.key = req.body.key;
    if (req.body.deepseekModelType != null) config.deepseekModelType = req.body.deepseekModelType;

    const updatedConfig = await config.save();
    res.json(updatedConfig);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;