# EnglishTable项目Ubuntu环境部署指南

本文档提供了如何在Ubuntu系统上部署和运行EnglishTable项目的详细指南。

## 快速开始

### 前提条件

在开始之前，请确保您的Ubuntu系统满足以下要求：

- Ubuntu 18.04或更高版本
- 具有sudo权限的用户账户
- 稳定的网络连接

### 使用提供的脚本

我们提供了一个自动化脚本`run_on_ubuntu.sh`，可以帮助您快速安装依赖并启动服务。

1. 首先，确保脚本具有执行权限：

   ```bash
   chmod +x run_on_ubuntu.sh
   ```

2. 以root权限运行脚本：

   ```bash
   sudo ./run_on_ubuntu.sh
   ```

   脚本将自动执行以下操作：
   - 更新系统包
   - 安装Node.js和npm
   - 安装Python3
   - 安装后端依赖
   - 检查并创建.env文件（如有必要）
   - 在后台启动后端服务（端口5000）
   - 在后台启动前端服务（端口8000）

3. 服务启动后，可以通过以下地址访问应用：
   ```
   http://localhost:8000
   ```

## 手动部署步骤

如果您希望手动部署而不使用脚本，可以按照以下步骤操作：

### 1. 安装必要的软件

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm python3
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

在`backend`目录下创建或编辑`.env`文件，添加MongoDB连接信息：

```bash
# MongoDB连接配置
MONGODB_URI=mongodb://localhost:27017/englishStudyDB
# 或者使用远程MongoDB Atlas连接
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/englishStudyDB?retryWrites=true&w=majority
```

### 4. 启动后端服务

```bash
cd backend
export NODE_ENV=production
npm start
```

### 5. 启动前端服务

在另一个终端窗口中：

```bash
python3 serve.py
```

## 配置MongoDB

### 本地MongoDB（可选）

如果您希望在本地运行MongoDB：

```bash
sudo apt install -y mongodb

sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### MongoDB Atlas（推荐）

对于生产环境，推荐使用MongoDB Atlas云数据库服务：

1. 在[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)注册账户并创建集群
2. 配置IP白名单，允许您的服务器访问
3. 创建数据库用户并获取连接字符串
4. 将连接字符串更新到backend/.env文件中的MONGODB_URI

## 服务管理

### 查看服务状态

```bash
# 查看后端服务日志
tail -f logs/backend.log

# 查看前端服务日志
tail -f logs/frontend.log
```

### 停止服务

```bash
# 查找并停止服务进程
ps aux | grep "node server.js" | grep -v grep | awk '{print $2}' | xargs kill
ps aux | grep "python3 serve.py" | grep -v grep | awk '{print $2}' | xargs kill
```

### 使用PM2管理Node.js服务（推荐）

对于生产环境，推荐使用PM2来管理Node.js服务：

```bash
# 安装PM2
npm install -g pm2

# 使用PM2启动后端服务
cd backend
pm install
pm install -g pm2
pm run dev
```

## 端口配置

默认情况下，服务将使用以下端口：
- 后端API：5000
- 前端Web：8000

如果需要修改端口，可以：
- 对于后端：修改`backend/server.js`中的端口配置
- 对于前端：修改`serve.py`中的PORT变量

## 安全建议

在生产环境中部署时，请考虑以下安全措施：

1. 不要在公共网络上暴露MongoDB的27017端口
2. 为MongoDB设置强密码
3. 使用HTTPS替代HTTP
4. 考虑使用Nginx作为反向代理
5. 定期更新系统和依赖包

## 常见问题排查

### 端口被占用

如果端口被占用，可以使用以下命令查找并释放端口：

```bash
# 查找占用端口的进程
lsof -i :5000  # 后端端口
lsof -i :8000  # 前端端口

# 终止占用端口的进程
kill -9 <进程ID>
```

### 数据库连接失败

如果遇到数据库连接问题：

1. 检查.env文件中的MONGODB_URI是否正确
2. 确认MongoDB服务正在运行
3. 检查防火墙设置是否允许连接
4. 查看backend.log获取详细错误信息

### 跨域问题

如果遇到跨域请求错误，请确认：
- 后端Express应用已正确配置CORS中间件
- 前端serve.py已正确设置CORS头部

## 联系我们

如有其他问题，请联系项目维护人员获取帮助。