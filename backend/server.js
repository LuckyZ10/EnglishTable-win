const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/englishStudyDB')
  .then(() => console.log('数据库连接成功'))
  .catch(err => console.error('数据库连接失败:', err));

// 路由
const recordRoutes = require('./routes/records');
const configRoutes = require('./routes/config');

app.use('/api/records', recordRoutes);
app.use('/api/config', configRoutes);

// 静态文件服务（用于生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});