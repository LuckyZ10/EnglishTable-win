const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// 获取所有记录
router.get('/', async (req, res) => {
  try {
    const records = await Record.find().sort({ timestamp: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 创建新记录
router.post('/', async (req, res) => {
  const record = new Record({
    word: req.body.word,
    translation: req.body.translation,
    example: req.body.example,
    note: req.body.note
  });

  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 获取单个记录
router.get('/:id', getRecord, (req, res) => {
  res.json(res.record);
});

// 更新记录
router.patch('/:id', getRecord, async (req, res) => {
  if (req.body.word != null) {
    res.record.word = req.body.word;
  }
  if (req.body.translation != null) {
    res.record.translation = req.body.translation;
  }
  if (req.body.example != null) {
    res.record.example = req.body.example;
  }
  if (req.body.note != null) {
    res.record.note = req.body.note;
  }
  res.record.timestamp = Date.now();

  try {
    const updatedRecord = await res.record.save();
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 删除记录
router.delete('/:id', getRecord, async (req, res) => {
  try {
    await res.record.deleteOne();
    res.json({ message: '记录已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 批量保存记录
router.post('/batch', async (req, res) => {
  try {
    // 首先清空所有记录
    await Record.deleteMany({});
    
    // 保存新记录
    const records = req.body.map(item => ({
      word: item.word,
      translation: item.translation,
      example: item.example,
      note: item.note,
      timestamp: item.timestamp || Date.now()
    }));
    
    const savedRecords = await Record.insertMany(records);
    res.json(savedRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 中间件函数：获取单个记录
async function getRecord(req, res, next) {
  let record;
  try {
    record = await Record.findById(req.params.id);
    if (record == null) {
      return res.status(404).json({ message: '找不到记录' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.record = record;
  next();
}

module.exports = router;