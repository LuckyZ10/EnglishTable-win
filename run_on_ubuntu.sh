#!/bin/bash

# EnglishTable项目Ubuntu环境运行脚本
# 此脚本将帮助在Ubuntu系统上安装依赖并启动应用

# 以root权限运行脚本
if [ "$EUID" -ne 0 ]
  then echo "请以root权限运行此脚本: sudo ./run_on_ubuntu.sh"
  exit
fi

# 更新系统包
echo "正在更新系统包..."
apt update && apt upgrade -y

# 安装Node.js和npm
echo "正在安装Node.js和npm..."
apt install -y nodejs npm

# 安装Python3和pip
echo "正在安装Python3..."
apt install -y python3

# 克隆项目（如果尚未克隆）
# 如果已经有项目，可以注释掉下面的行
# echo "正在克隆项目..."
# git clone <项目仓库地址>
# cd EnglishTable-main

# 确保当前在项目根目录
if [ ! -f "serve.py" ]; then
  echo "错误：未在项目根目录下运行此脚本。请切换到包含serve.py的目录后重试。"
  exit 1
fi

# 安装后端依赖
echo "正在安装后端依赖..."
cd backend
npm install

# 检查.env文件是否存在
if [ ! -f ".env" ]; then
  echo "警告：未找到.env文件，将创建一个示例.env文件"
  echo "# MongoDB配置示例
MONGODB_URI=mongodb://localhost:27017/englishStudyDB" > .env
  echo "请根据实际情况编辑backend/.env文件，设置正确的MongoDB连接信息"
fi

# 启动后端服务
cd ..

# 创建日志目录
mkdir -p logs

# 启动后端服务（在后台运行）
echo "正在启动后端服务..."
cd backend
export NODE_ENV=production
nohup npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "后端服务已启动，PID: $BACKEND_PID，日志文件: ../logs/backend.log"

# 等待后端服务启动
sleep 5

# 启动前端服务（在后台运行）
cd ..
echo "正在启动前端服务..."
nohup python3 serve.py > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端服务已启动，PID: $FRONTEND_PID，日志文件: logs/frontend.log"

# 显示服务状态
echo "\n服务状态信息："
echo "后端服务：已在后台启动（端口5000）"
echo "前端服务：已在后台启动（端口8000）"
echo "\n访问地址：http://localhost:8000"
echo "\n查看后端日志：tail -f logs/backend.log"
echo "查看前端日志：tail -f logs/frontend.log"
echo "\n停止服务命令："
echo "kill $BACKEND_PID $FRONTEND_PID"