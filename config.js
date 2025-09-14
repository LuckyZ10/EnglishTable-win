// 应用配置文件 - 用于设置API连接地址
// 说明：如果需要从其他设备访问应用，请在此文件中修改API地址
// 例如：将localhost替换为服务器的公网IP地址或域名

const APP_CONFIG = {
  // API基础地址
  API_BASE_URL: 'http://8.149.244.126:5000/api'
};

// 如果是在浏览器环境中，将配置挂载到window对象
if (typeof window !== 'undefined') {
  window.APP_CONFIG = APP_CONFIG;
}

// 如果是在Node.js环境中，导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APP_CONFIG;
}