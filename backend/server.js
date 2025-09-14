const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 明确指定.env文件路径，确保正确读取
require('dotenv').config({
  path: __dirname + '/.env'
});

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 连接数据库
console.log('MongoDB URI 配置状态:', process.env.MONGODB_URI ? '已配置' : '未配置');

// 确保使用MongoDB Atlas连接，不回退到本地数据库
if (!process.env.MONGODB_URI) {
  console.error('错误: 未配置MONGODB_URI环境变量');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('数据库连接成功'))
  .catch(err => {
    console.error('数据库连接失败:', err);
    // 连接失败时退出进程，避免服务在错误状态下运行
    process.exit(1);
  });

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