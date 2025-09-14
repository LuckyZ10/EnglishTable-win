# 英语学习记录应用

一个简洁美观的英语学习记录网页应用，帮助你记录学习的单词和句子，并通过AI自动翻译。

## 功能特点

- 📝 **记录管理**：添加、编辑、删除英语学习记录
- 🤖 **AI翻译**：支持多种大模型API自动翻译（OpenAI、Anthropic、Gemini等）
- 💾 **本地存储**：所有记录和配置保存在本地浏览器中
- 🌙 **深色模式**：支持明暗主题切换
- 📊 **数据导出**：支持将记录导出为CSV文件
- 📱 **响应式设计**：适配各种屏幕尺寸

## 快速开始

1. 将项目克隆到本地
   ```bash
   git clone https://github.com/yourusername/english-learning-records.git
   ```

2. 打开 `index.html` 文件即可使用应用
   - 无需服务器，直接在浏览器中运行
   - 所有数据存储在浏览器的本地存储中

## API配置

应用支持以下几种API提供商：

1. **OpenAI**：使用GPT模型进行翻译
2. **Anthropic**：使用Claude模型进行翻译
3. **Gemini**：使用Google Gemini模型进行翻译
4. **本地模拟**：无需API密钥，用于快速体验

### 获取API密钥

- **OpenAI**：访问 [OpenAI API](https://platform.openai.com/api-keys) 获取
- **Anthropic**：访问 [Anthropic Console](https://console.anthropic.com/) 获取
- **Gemini**：访问 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取

### 配置方法

1. 在应用界面中找到"AI翻译配置"区域
2. 选择API提供商
3. 输入API密钥
4. 点击"保存配置"按钮

## 本地开发

如需进行开发或修改，可以直接编辑以下文件：

- `index.html`：网页结构和基本布局
- `style.css`：样式定义
- `script.js`：核心功能逻辑

## 技术栈

- HTML5
- Tailwind CSS v3
- JavaScript
- Font Awesome

## 注意事项

1. 所有数据存储在浏览器的本地存储中，清空浏览器数据会导致记录丢失
2. 导出的CSV文件使用UTF-8编码，建议使用Excel或其他支持UTF-8的软件打开
3. 使用API功能时，请注意保护好你的API密钥，不要泄露给他人
4. API调用可能会产生费用，请参考各API提供商的定价政策

## 贡献

欢迎提交Issue或Pull Request来帮助改进这个项目！

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解更多详情。