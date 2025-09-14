// 英语学习记录应用 - 统一版

// DOM 元素引用
const wordInput = document.getElementById('word-input');
const noteInput = document.getElementById('note-input');
const addRecordBtn = document.getElementById('add-record');
const recordsTable = document.getElementById('records-table');
const loadingModal = document.getElementById('loading-modal');
const loadingMessage = document.getElementById('loading-message');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');
const themeToggle = document.getElementById('theme-toggle');
const exportBtn = document.getElementById('export-btn');
const apiProvider = document.getElementById('api-provider');
const apiKey = document.getElementById('api-key');
const saveConfigBtn = document.getElementById('save-config');
const testApiBtn = document.getElementById('test-api');
const apiStatus = document.getElementById('api-status');
const deepseekModelSelector = document.getElementById('deepseek-model-selector');
const deepseekModelType = document.getElementById('deepseek-model-type');
const userRoleSelector = document.getElementById('user-role');
const selectAllCheckbox = document.getElementById('select-all');
const exportModal = document.getElementById('export-modal');
const modalContent = document.getElementById('modal-content');
const exportFilenameInput = document.getElementById('export-filename');
// 密码验证模态框元素
const passwordModal = document.getElementById('password-modal');
const adminPasswordInput = document.getElementById('admin-password');
const cancelPasswordBtn = document.getElementById('cancel-password');
const confirmPasswordBtn = document.getElementById('confirm-password');

// 应用配置和记录
let appConfig = {
  provider: 'local',
  key: '',
  userRole: 'admin', // 默认管理员角色
  deepseekModelType: 'auto', // 默认自动选择DeepSeek模型
  darkMode: false
};
let studyRecords = [];

// 默认管理员密码
const DEFAULT_ADMIN_PASSWORD = 'admin123';
// 临时存储要切换的新角色
let pendingRoleChange = null;

// 初始化应用
function initApp() {
  console.log('开始初始化应用...');
  
  console.log('初始化默认配置...');
  // 设置默认配置（不清除现有数据）
  appConfig = {
    provider: 'local',
    key: '',
    userRole: 'admin', // 默认管理员角色
    deepseekModelType: 'auto',
    darkMode: false
  };
  
  console.log('加载配置和记录...');
  // 从本地存储加载配置和记录
  loadConfig();
  loadStudyRecords();
  
  console.log('应用主题...');
  // 应用主题
  applyTheme();
  
  console.log('初始化UI...');
  // 初始化UI
  updateUIPermissions();
  renderStudyRecords();
  toggleDeepseekModelSelector();
  
  console.log('绑定事件监听器...');
  // 绑定事件监听器
  bindEventListeners();
  
  console.log('检查角色选择器状态...');
  console.log('当前角色:', appConfig.userRole);
  console.log('角色选择器值:', userRoleSelector.value);
  console.log('角色选择器是否启用:', !userRoleSelector.disabled);
  
  console.log('应用初始化完成!');
  
  // 添加测试翻译按钮
  setTimeout(addTestTranslationButton, 1000);
}

// 从本地存储加载配置
function loadConfig() {
  try {
    const savedConfig = localStorage.getItem('translationConfig');
    if (savedConfig) {
      appConfig = { ...appConfig, ...JSON.parse(savedConfig) };
      
      // 应用加载的配置到表单
      apiProvider.value = appConfig.provider;
      apiKey.value = appConfig.key;
      deepseekModelType.value = appConfig.deepseekModelType;
      userRoleSelector.value = appConfig.userRole;
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }
}

// 保存配置到本地存储
function saveConfig() {
  try {
    localStorage.setItem('translationConfig', JSON.stringify(appConfig));
  } catch (error) {
    console.error('保存配置失败:', error);
  }
}

// 从本地存储加载学习记录
function loadStudyRecords() {
  try {
    const savedRecords = localStorage.getItem('englishRecords');
    if (savedRecords) {
      studyRecords = JSON.parse(savedRecords);
    }
  } catch (error) {
    console.error('加载学习记录失败:', error);
  }
}

// 保存学习记录到本地存储
function saveStudyRecords() {
  try {
    localStorage.setItem('englishRecords', JSON.stringify(studyRecords));
  } catch (error) {
    console.error('保存学习记录失败:', error);
  }
}

// 应用主题
function applyTheme() {
  if (appConfig.darkMode || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fa fa-sun-o text-yellow-400"></i>';
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fa fa-moon-o text-blue-600"></i>';
  }
}

// 切换主题
function toggleTheme() {
  appConfig.darkMode = !appConfig.darkMode;
  saveConfig();
  applyTheme();
}

// 获取用户角色
function getUserRole() {
  return appConfig.userRole || 'admin';
}

// 添加测试翻译按钮到UI
function addTestTranslationButton() {
  // 检查按钮是否已存在
  if (document.getElementById('test-translation-btn')) {
    return;
  }
  
  // 创建按钮容器
  const container = document.createElement('div');
  container.className = 'flex justify-center mt-4';
  
  // 创建测试按钮
  const testBtn = document.createElement('button');
  testBtn.id = 'test-translation-btn';
  testBtn.className = 'bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center transition-colors';
  testBtn.innerHTML = '<i class="fa fa-language mr-2"></i>测试翻译功能';
  
  // 添加点击事件
  testBtn.addEventListener('click', testTranslation);
  
  // 添加到页面
  container.appendChild(testBtn);
  document.body.appendChild(container);
}

// 检查用户权限
function checkPermission(requiredRole) {
  // 移除角色权限区分，所有用户都有完全权限
  return true;
}

// 根据用户角色更新UI元素权限
function updateUIPermissions() {
  // 移除角色权限区分，所有用户界面元素都可用
  
  // API配置区域
  apiProvider.disabled = false;
  apiKey.disabled = false;
  saveConfigBtn.disabled = false;
  testApiBtn.disabled = false;
  deepseekModelType.disabled = false;
  
  // 添加记录区域
  wordInput.disabled = false;
  noteInput.disabled = false;
  addRecordBtn.disabled = false;
  
  // 导出权限
  exportBtn.disabled = false;
  
  // 角色选择器
  userRoleSelector.disabled = false;
  
  // 表格中的编辑和删除按钮
  document.querySelectorAll('.edit-record').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('opacity-50');
  });
  
  document.querySelectorAll('.delete-record').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('opacity-50');
  });
  
  // 表格中的复选框
  document.querySelectorAll('.record-checkbox').forEach(checkbox => {
    checkbox.disabled = false;
  });
  
  // 全选复选框
  selectAllCheckbox.disabled = false;
}

// 切换DeepSeek模型选择器的显示状态
function toggleDeepseekModelSelector() {
  // 移除权限控制，根据API提供商直接显示或隐藏
  if (apiProvider.value === 'deepseek') {
    deepseekModelSelector.classList.remove('hidden');
  } else {
    deepseekModelSelector.classList.add('hidden');
  }
}

// 保存API配置
function handleSaveConfig() {
  // 移除权限检查，所有用户都可以修改配置
  
  const provider = apiProvider.value;
  const key = apiKey.value;
  const deepseekModel = deepseekModelType.value;
  
  // 验证API密钥
  if (!validateApiKey(provider, key)) {
    return;
  }
  
  // 更新配置
  appConfig.provider = provider;
  appConfig.key = key;
  appConfig.deepseekModelType = deepseekModel;
  
  saveConfig();
  showToast('success', '配置已保存');
}

// 编辑记录
function editRecord(recordId) {
  // 移除权限检查，所有用户都可以编辑记录
  
  const record = studyRecords.find(r => r.id === recordId);
  if (!record) return;
  
  // 填充输入框
  wordInput.value = record.word;
  noteInput.value = record.note || '';
  
  // 滚动到输入区域
  wordInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  wordInput.focus();
  
  // 临时保存记录ID以便更新
  wordInput.dataset.editId = recordId;
  
  // 更改按钮文本为"更新记录"
  addRecordBtn.innerHTML = '<i class="fa fa-check mr-2"></i>更新记录';
}

// 删除记录
function deleteRecord(recordId) {
  // 移除权限检查，所有用户都可以删除记录
  
  if (confirm('确定要删除这条学习记录吗？')) {
    // 过滤掉要删除的记录
    studyRecords = studyRecords.filter(r => r.id !== recordId);
    
    // 保存更新后的记录
    saveStudyRecords();
    
    // 重新渲染记录
    renderStudyRecords();
    
    // 显示成功提示
    showToast('success', '学习记录已删除');
  }
}

// 显示导出模态框
function showExportModal() {
  // 移除权限检查，所有用户都可以导出记录
  
  // 设置文件名
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  exportFilenameInput.value = `学习记录_${dateStr}`;
  
  // 显示模态框
  exportModal.classList.remove('hidden');
  // 添加动画
  setTimeout(() => {
    modalContent.classList.remove('scale-95', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
}

// 隐藏导出模态框
function hideExportModal() {
  // 添加动画
  modalContent.classList.remove('scale-100', 'opacity-100');
  modalContent.classList.add('scale-95', 'opacity-0');
  // 隐藏模态框
  setTimeout(() => {
      exportModal.classList.add('hidden');
  }, 300);
}

// 处理导出
function handleExport() {
  const filename = exportFilenameInput.value.trim() || `学习记录_${new Date().toISOString().split('T')[0]}`;
  let dataToExport = [];

  // 导出所有记录
  dataToExport = studyRecords;

  if (dataToExport.length === 0) {
      showToast('warning', '没有可导出的记录');
      return;
  }

  // 导出为CSV
  exportAsCSV(dataToExport, filename);

  // 隐藏模态框
  hideExportModal();

  // 显示成功提示
  showToast('success', '记录导出成功');
}

// 导出为CSV
function exportAsCSV(data, filename) {
  const headers = ['序号', '单词/句子', '中文翻译', '应用示例', '学习笔记', '时间戳'];
  const csvContent = [
      headers.join(','),
      ...data.map((record, index) => [
          index + 1,
          `"${escapeCSV(record.word)}"`,
          `"${escapeCSV(record.translation)}"`,
          `"${escapeCSV(record.example)}"`,
          `"${escapeCSV(record.note || '')}"`,
          record.timestamp
      ].join(','))
  ].join('\n');

  downloadFile(csvContent, filename + '.csv', 'text/csv;charset=utf-8;');
}

// 下载文件
function downloadFile(content, filename, contentType) {
  const link = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  link.href = URL.createObjectURL(file);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// 转义CSV中的特殊字符
function escapeCSV(text) {
  if (!text) return '';
  return text.replace(/"/g, '""');
}

// 转义HTML特殊字符
function escapeHTML(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 显示加载中模态框
function showLoading(message = '正在处理...') {
  loadingMessage.textContent = message;
  loadingModal.classList.remove('hidden');
}

// 隐藏加载中模态框
function hideLoading() {
  loadingModal.classList.add('hidden');
}

// 显示提示消息
function showToast(type, message, duration = 3000) {
  // 设置图标
  switch (type) {
      case 'success':
          toastIcon.className = 'fa fa-check-circle mr-2';
          toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center transform translate-y-20 opacity-0 transition-all duration-300 z-50';
          break;
      case 'error':
          toastIcon.className = 'fa fa-exclamation-circle mr-2';
          toast.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center transform translate-y-20 opacity-0 transition-all duration-300 z-50';
          break;
      case 'warning':
          toastIcon.className = 'fa fa-exclamation-triangle mr-2';
          toast.className = 'fixed bottom-4 right-4 bg-yellow-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center transform translate-y-20 opacity-0 transition-all duration-300 z-50';
          break;
      case 'info':
      default:
          toastIcon.className = 'fa fa-info-circle mr-2';
          toast.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center transform translate-y-20 opacity-0 transition-all duration-300 z-50';
          break;
  }

  // 设置消息
  toastMessage.textContent = message;

  // 显示提示
  setTimeout(() => {
      toast.classList.remove('translate-y-20', 'opacity-0');
  }, 10);

  // 自动隐藏
  setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
  }, duration);
}

// 全选/取消全选
function toggleSelectAll() {
  const isChecked = selectAllCheckbox.checked;
  document.querySelectorAll('.record-checkbox').forEach(checkbox => {
      if (!checkbox.disabled) {
          checkbox.checked = isChecked;
      }
  });
}

// 更新全选状态
function updateSelectAllState() {
  const checkboxes = document.querySelectorAll('.record-checkbox:not(:disabled)');
  const checkedBoxes = document.querySelectorAll('.record-checkbox:not(:disabled):checked');
  selectAllCheckbox.checked = checkboxes.length > 0 && checkboxes.length === checkedBoxes.length;
  selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
}

// 恢复管理员权限
function restoreAdminAccess() {
  // 重置用户角色为管理员
  appConfig.userRole = 'admin';
  userRoleSelector.value = 'admin';
  // 保存配置
  saveConfig();
  // 更新UI权限
  updateUIPermissions();
  // 显示成功提示
  showToast('success', '管理员权限已恢复');
}

// 暴露全局方法以便在控制台调用
window.restoreAdminAccess = restoreAdminAccess;

// 添加一个简单的测试函数用于验证翻译功能
testTranslation = async function() {
  try {
    console.log('开始测试翻译功能...');
    const result = await translateText('Hello world');
    console.log('翻译结果:', result);
    showToast('success', '翻译测试成功! 结果: ' + result.translation);
    return result;
  } catch (error) {
    console.error('翻译测试失败:', error);
    showToast('error', '翻译测试失败: ' + error.message);
  }
};

// 绑定事件监听器
function bindEventListeners() {
  // API提供商变更时显示或隐藏DeepSeek模型选择器
  apiProvider.addEventListener('change', toggleDeepseekModelSelector);
  
  // 保存配置按钮事件
  saveConfigBtn.addEventListener('click', handleSaveConfig);
  
  // 测试API连接按钮事件
  testApiBtn.addEventListener('click', async () => {
    // 实现完整的API测试功能
    const provider = apiProvider.value;
    const key = apiKey.value;
    
    // 本地模式无需测试
    if (provider === 'local') {
      showToast('success', '本地模式无需API测试');
      return;
    }
    
    // 验证API密钥格式
    if (!validateApiKey(provider, key)) {
      return;
    }
    
    // 显示加载状态
    showLoading('正在测试API连接...');
    
    try {
      // 测试不同API提供商的连接
      const testResult = await testApiConnection(provider, key);
      
      // 显示测试结果
      if (testResult.success) {
        showToast('success', testResult.message || 'API连接测试成功');
        // 更新API状态显示
        apiStatus.className = 'text-green-500';
        apiStatus.textContent = '✓ API连接正常';
      } else {
        showToast('error', testResult.message || 'API连接测试失败');
        // 更新API状态显示
        apiStatus.className = 'text-red-500';
        apiStatus.textContent = '✗ API连接异常';
      }
    } catch (error) {
      console.error('API测试错误:', error);
      showToast('error', 'API测试失败：' + error.message);
      // 更新API状态显示
      apiStatus.className = 'text-red-500';
      apiStatus.textContent = '✗ API连接异常';
    } finally {
      hideLoading();
    }
  });
  
  // 添加记录按钮事件
  addRecordBtn.addEventListener('click', addRecord);
  
  // 回车键添加记录
  wordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addRecord();
    }
  });
  
  // 主题切换按钮事件
  themeToggle.addEventListener('click', toggleTheme);
  
  // 导出按钮事件
  exportBtn.addEventListener('click', showExportModal);
  
  // 取消导出按钮事件
  document.getElementById('cancel-export')?.addEventListener('click', hideExportModal);
  
  // 确认导出按钮事件
  document.getElementById('confirm-export')?.addEventListener('click', handleExport);
  
  // 用户角色选择器事件
  userRoleSelector?.addEventListener('change', changeUserRole);
  
  // 密码验证模态框事件
  cancelPasswordBtn?.addEventListener('click', hidePasswordModal);
  confirmPasswordBtn?.addEventListener('click', confirmRoleChange);
  
  // 密码输入框回车键确认
  adminPasswordInput?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      confirmRoleChange();
    }
  });
  
  // 点击模态框外部关闭
  passwordModal?.addEventListener('click', function(e) {
    if (e.target === passwordModal) {
      hidePasswordModal();
    }
  });
  
  // 全选复选框事件
  selectAllCheckbox?.addEventListener('change', toggleSelectAll);
  
  // 为所有表格行添加点击事件（委托）
  recordsTable.addEventListener('click', function(e) {
    // 处理复选框点击
    if (e.target.classList.contains('record-checkbox')) {
      updateSelectAllState();
      return;
    }
    
    // 处理编辑按钮点击
    if (e.target.closest('.edit-record')) {
      const id = parseInt(e.target.closest('.edit-record').closest('tr').dataset.id);
      editRecord(id);
      return;
    }
    
    // 处理删除按钮点击
    if (e.target.closest('.delete-record')) {
      const id = parseInt(e.target.closest('.delete-record').closest('tr').dataset.id);
      deleteRecord(id);
      return;
    }
  });
}

// 文档加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 显示密码验证模态框 - 简化为仅记录日志，不再显示模态框
function showPasswordModal(newRole) {
  console.log('角色切换请求已简化处理，无需密码验证');
  confirmRoleChangeDirectly(newRole); // 直接应用新角色
}

// 隐藏密码验证模态框 - 简化为仅记录日志
function hidePasswordModal() {
  console.log('隐藏密码模态框功能已简化');
}

// 验证管理员密码 - 简化为始终返回true
function validateAdminPassword(password) {
  return true; // 不再需要验证密码
}

// 切换用户角色 - 简化为直接应用新角色
function changeUserRole() {
  console.log('角色切换功能已简化，所有用户都有相同权限');
  const newRole = userRoleSelector.value;
  confirmRoleChangeDirectly(newRole);
}

// 直接确认角色切换 - 仅更新UI但不影响实际权限
function confirmRoleChangeDirectly(newRole) {
  console.log(`角色设置为: ${newRole}（仅作为显示，不影响实际权限）`);
  appConfig.userRole = newRole;
  userRoleSelector.value = newRole;
  saveConfig();
  updateUIPermissions();
  console.log('角色设置已更新');
}

// 确认角色切换 - 简化为直接调用confirmRoleChangeDirectly
function confirmRoleChange() {
  console.log('密码验证流程已简化');
  if (pendingRoleChange) {
    confirmRoleChangeDirectly(pendingRoleChange);
  }
  hidePasswordModal();
}

// 获取角色显示名称 - 保留用于显示
function getRoleDisplayName(role) {
  const roleNames = {
    'admin': '管理员',
    'editor': '编辑者',
    'viewer': '查看者'
  };
  return roleNames[role] || role;
}

// 添加新记录
async function addRecord() {
  // 移除隐含的权限检查，所有用户都可以添加记录
  const word = wordInput.value.trim();
  const note = noteInput.value.trim();
  const editId = parseInt(wordInput.dataset.editId); // 获取编辑记录的ID
  
  if (!word) {
    showToast('error', '请输入单词或句子');
    return;
  }
  
  // 限制输入长度
  if (word.length > 200) {
    showToast('error', '单词或句子过长，请保持在200字以内');
    return;
  }

  // 检查是否存在重复单词
  // 在编辑模式下，跳过当前编辑的记录
  const isDuplicate = studyRecords.some(record => 
    record.id !== editId && record.word.toLowerCase() === word.toLowerCase()
  );
  
  if (isDuplicate) {
    showToast('warning', '该单词或句子已存在，请不要重复添加');
    return;
  }

  // 验证API配置（这是功能性验证，不是权限验证）
  if (appConfig.provider !== 'local') {
    if (!appConfig.key) {
      showToast('error', '请先配置有效的API密钥');
      return;
    }
  }

  // 显示加载中状态
  showLoading('正在处理中...');

  try {
    // 如果是编辑模式，直接更新记录
    if (!isNaN(editId)) {
      const recordIndex = studyRecords.findIndex(r => r.id === editId);
      if (recordIndex !== -1) {
        // 获取翻译（如果单词有变化）
        let translationResult = {
          translation: studyRecords[recordIndex].translation,
          example: studyRecords[recordIndex].example
        };
        
        if (word !== studyRecords[recordIndex].word) {
          translationResult = await translateText(word);
        }
        
        // 更新记录
        studyRecords[recordIndex] = {
          ...studyRecords[recordIndex],
          word: word,
          translation: translationResult.translation,
          example: translationResult.example,
          note: note,
          timestamp: new Date().toISOString()
        };
        
        // 清除编辑ID
        delete wordInput.dataset.editId;
        
        // 恢复按钮文本
        addRecordBtn.innerHTML = '<i class="fa fa-plus mr-2"></i>添加记录';
        
        // 显示成功提示
        showToast('success', '学习记录更新成功');
      }
    } else {
      // 否则，创建新记录
      // 获取翻译
      const translationResult = await translateText(word);
      
      // 创建新记录
      const newRecord = {
        id: Date.now(),
        word: word,
        translation: translationResult.translation,
        example: translationResult.example,
        note: note,
        timestamp: new Date().toISOString()
      };

      // 添加到记录数组
      studyRecords.unshift(newRecord);

      // 显示成功提示
      showToast('success', '学习记录添加成功');
    }

    // 保存记录
    saveStudyRecords();

    // 渲染记录
    renderStudyRecords();

    // 清空输入框
    wordInput.value = '';
    noteInput.value = '';
  } catch (error) {
    console.error('添加/更新记录错误:', error);
    showToast('error', '处理记录失败：' + error.message);
  } finally {
    hideLoading();
  }
}

// 验证API密钥格式
function validateApiKey(provider, key) {
  // 仅进行功能性验证，不包含权限检查
  if (provider === 'local') {
    return true; // 本地模式无需验证
  }
  
  if (!key) {
    showToast('error', '请输入API密钥');
    return false;
  }
  
  // 简单的格式验证
  switch(provider) {
    case 'openai':
      // OpenAI API密钥格式：sk-开头
      if (!/^sk-/.test(key)) {
        showToast('error', 'OpenAI API密钥格式不正确，应以sk-开头');
        return false;
      }
      break;
    case 'anthropic':
      // Anthropic API密钥格式：sk-ant-开头
      if (!/^sk-ant-/.test(key)) {
        showToast('error', 'Anthropic API密钥格式不正确，应以sk-ant-开头');
        return false;
      }
      break;
    case 'gemini':
      // Gemini API密钥格式：字母数字组合
      if (key.length < 10) {
        showToast('error', 'Gemini API密钥格式不正确，长度过短');
        return false;
      }
      break;
    case 'deepseek':
      // DeepSeek API密钥格式：sk-开头
      if (!/^sk-/.test(key)) {
        showToast('error', 'DeepSeek API密钥格式不正确，应以sk-开头');
        return false;
      }
      break;
  }
  
  return true;
}

// 本地模式翻译函数 - 简单的中英词典和例句生成
function translateLocal(text) {
  // 简单的中英词典
  const simpleDictionary = {
    'hello': '你好',
    'world': '世界',
    'good morning': '早上好',
    'good afternoon': '下午好',
    'thank you': '谢谢',
    'sorry': '对不起',
    'please': '请',
    'yes': '是',
    'no': '否',
    'goodbye': '再见',
    'welcome': '欢迎',
    'excuse me': '对不起，打扰一下',
    'how are you': '你好吗',
    'I am fine': '我很好',
    'learning': '学习',
    'english': '英语',
    'vocabulary': '词汇',
    'sentence': '句子',
    'practice': '练习',
    'study': '学习',
    'read': '阅读',
    'write': '写作',
    'listen': '听',
    'speak': '说'
  };

  // 将文本转为小写进行匹配
  const textLower = text.toLowerCase();
  
  // 检查是否在词典中有直接匹配
  let translation = simpleDictionary[textLower] || text;
  
  // 生成英文例句和中文例句
  let englishExample = '';
  let chineseExample = '';
  
  // 为常见单词生成例句
  switch(textLower) {
    case 'hello':
      englishExample = 'Hello, nice to meet you!';
      chineseExample = '你好，很高兴见到你！';
      break;
    case 'world':
      englishExample = 'The world is a beautiful place.';
      chineseExample = '世界是一个美丽的地方。';
      break;
    case 'good morning':
      englishExample = 'Good morning, everyone!';
      chineseExample = '大家早上好！';
      break;
    case 'thank you':
      englishExample = 'Thank you for your help.';
      chineseExample = '感谢你的帮助。';
      break;
    case 'sorry':
      englishExample = 'I\'m sorry for being late.';
      chineseExample = '对不起，我迟到了。';
      break;
    case 'please':
      englishExample = 'Please pass me the book.';
      chineseExample = '请把书递给我。';
      break;
    case 'how are you':
      englishExample = 'How are you doing today?';
      chineseExample = '你今天过得怎么样？';
      break;
    case 'learning':
      englishExample = 'I enjoy learning new things.';
      chineseExample = '我喜欢学习新事物。';
      break;
    case 'english':
      englishExample = 'English is an important language.';
      chineseExample = '英语是一门重要的语言。';
      break;
    default:
      // 为没有特定例句的单词生成通用例句
      englishExample = `I am learning the word "${text}".`;
      chineseExample = `我正在学习"${translation}"这个单词。`;
  }
  
  // 按照我们之前定义的格式返回结果
  // 这样extractTranslationAndExample函数就能正确处理
  const combinedExample = `${englishExample}\n${chineseExample}`;
  
  return {
    translation: translation,
    example: combinedExample
  };
}

// 翻译文本函数
async function translateText(text) {
  try {
    // 本地模式翻译（使用简单的中英词典）
    if (appConfig.provider === 'local') {
      return translateLocal(text);
    }

    // 检查API密钥
    if (!appConfig.key) {
      throw new Error('请先配置有效的API密钥');
    }

    // 根据不同的API提供商构建请求
    let apiUrl, headers, requestData;
    headers = {
      'Content-Type': 'application/json'
    };

    // 更新系统提示，要求提供英文例句和对应的中文翻译
    const systemPrompt = '你是一个英语翻译助手，请将英文单词或句子翻译成中文，并提供一个英文例句和对应的中文翻译。例句必须紧密结合日常交流和工作环境，使用自然、实用的表达。回复格式应为：翻译内容\n\n英文例句：[英文例句内容]\n中文例句：[中文例句翻译]';
    const userPrompt = text;

    switch (appConfig.provider) {
      case 'openai':
        apiUrl = 'https://api.openai.com/v1/chat/completions';
        headers.Authorization = `Bearer ${appConfig.key}`;
        requestData = {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 500
        };
        break;
      case 'anthropic':
        apiUrl = 'https://api.anthropic.com/v1/messages';
        headers.Authorization = `Bearer ${appConfig.key}`;
        headers['anthropic-version'] = '2023-06-01';
        requestData = {
          model: 'claude-3-sonnet-20240229',
          messages: [
            { role: 'user', content: `请将英文单词或句子翻译成中文，并提供一个英文例句和对应的中文翻译。例句必须紧密结合日常交流和工作环境，使用自然、实用的表达。回复格式应为：翻译内容\n\n英文例句：[英文例句内容]\n中文例句：[中文例句翻译]\n\n要翻译的内容：${userPrompt}` }
          ],
          max_tokens: 500
        };
        break;
      case 'gemini':
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${appConfig.key}`;
        requestData = {
          contents: [
            {
              parts: [
                { text: `请将英文单词或句子翻译成中文，并提供一个英文例句和对应的中文翻译。例句必须紧密结合日常交流和工作环境，使用自然、实用的表达。回复格式应为：翻译内容\n\n英文例句：[英文例句内容]\n中文例句：[中文例句翻译]\n\n要翻译的内容：${userPrompt}` }
              ]
            }
          ]
        };
        break;
      case 'deepseek':
        apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        headers.Authorization = `Bearer ${appConfig.key}`;
        // 验证并使用有效的DeepSeek模型
        const validDeepseekModels = ['deepseek-chat', 'deepseek-reasoner'];
        let deepseekModel = 'deepseek-chat'; // 默认使用标准模型
        
        // 根据用户选择的模型类型设置对应的模型名称
        if (appConfig.deepseekModelType === 'reasoner') {
          deepseekModel = 'deepseek-reasoner';
        } else if (appConfig.deepseekModelType === 'auto') {
          // 自动模式下，对于简单文本使用标准模型，复杂文本可以考虑使用reasoner模型
          // 这里简化处理，统一使用标准模型
          deepseekModel = 'deepseek-chat';
        }
        
        // 确保使用有效的模型名称
        if (!validDeepseekModels.includes(deepseekModel)) {
          deepseekModel = 'deepseek-chat'; // 默认使用标准模型
        }
        
        requestData = {
          model: deepseekModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 500
        };
        break;
      default:
        throw new Error('不支持的翻译服务提供商');
    }

    // 发送API请求
    console.log(`发送请求到 ${appConfig.provider} API...`);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData)
    });

    // 检查响应状态
    if (!response.ok) {
      // 尝试获取详细的错误信息
      let errorData = null;
      try {
        errorData = await response.json();
        console.error(`${appConfig.provider} API错误响应:`, errorData);
      } catch (e) {
        console.error('无法解析错误响应:', e);
      }
      
      const errorMessage = errorData?.error?.message || `API请求失败: ${response.status} ${response.statusText}`;
      // 特殊处理DeepSeek模型不存在的错误
      if (appConfig.provider === 'deepseek' && errorMessage.includes('Model Not Exist')) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}。详细信息: DeepSeek模型不存在，请选择有效的模型`);
      }
      throw new Error(`API请求失败: ${response.status} ${response.statusText}。详细信息: ${errorMessage}`);
    }

    // 解析响应数据
    const data = await response.json();
    console.log(`${appConfig.provider} API响应:`, data);

    // 提取翻译结果和例句
    let translation = '', example = '';

    // 处理不同API的响应格式
    switch (appConfig.provider) {
      case 'openai':
        if (data.choices && data.choices.length > 0) {
          const content = data.choices[0].message.content;
          const result = extractTranslationAndExample(content);
          translation = result.translation;
          example = result.example;
        }
        break;
      case 'anthropic':
        if (data.content && data.content.length > 0) {
          const content = data.content[0].text;
          const result = extractTranslationAndExample(content);
          translation = result.translation;
          example = result.example;
        }
        break;
      case 'gemini':
        if (data.candidates && data.candidates.length > 0 && 
            data.candidates[0].content && data.candidates[0].content.parts && 
            data.candidates[0].content.parts.length > 0) {
          const content = data.candidates[0].content.parts[0].text;
          const result = extractTranslationAndExample(content);
          translation = result.translation;
          example = result.example;
        }
        break;
      case 'deepseek':
        if (data.choices && data.choices.length > 0) {
          const content = data.choices[0].message.content;
          const result = extractTranslationAndExample(content);
          translation = result.translation;
          example = result.example;
        }
        break;
    }

    // 如果没有提取到翻译结果，使用默认内容
    if (!translation) {
      translation = '翻译失败，请稍后重试';
    }

    return {
      translation: translation,
      example: example
    };
  } catch (error) {
    console.error('翻译过程中发生错误:', error);
    // 返回包含错误信息的默认结果
    return {
      translation: `翻译失败: ${error.message}`,
      example: ''
    };
  }
}

// 提取翻译和例句的辅助函数
function extractTranslationAndExample(text) {
    console.log('开始提取翻译和例句:', text);
    
    // 检查是否包含英文例句和中文例句格式
    if (text.includes('英文例句：') && text.includes('中文例句：')) {
        // 提取翻译内容（第一个换行符之前的部分）
        const firstNewLineIndex = text.indexOf('\n');
        let translation = firstNewLineIndex > -1 ? text.substring(0, firstNewLineIndex).trim() : text.trim();
        
        // 移除可能存在的"翻译内容"前缀
        translation = translation.replace(/^翻译内容：?/, '').trim();
        
        // 提取英文例句
        const englishExampleMatch = text.match(/英文例句：([\s\S]*?)(?=中文例句：|$)/);
        const englishExample = englishExampleMatch ? englishExampleMatch[1].trim() : '';
        
        // 提取中文例句
        const chineseExampleMatch = text.match(/中文例句：([\s\S]*)/);
        const chineseExample = chineseExampleMatch ? chineseExampleMatch[1].trim() : '';
        
        // 将英文例句和中文例句合并显示
        const combinedExample = englishExample && chineseExample 
            ? `${englishExample}\n${chineseExample}` 
            : (englishExample || chineseExample || '');
        
        return {
            translation: translation,
            example: combinedExample
        };
    }
    
    // 检查是否包含XML标签格式
    if (text.includes('<translation>') && text.includes('</translation>')) {
        const translationMatch = text.match(/<translation>(.*?)<\/translation>/s);
        const exampleMatch = text.match(/<example>(.*?)<\/example>/s);
        
        return {
            translation: translationMatch ? translationMatch[1].trim() : '未找到翻译',
            example: exampleMatch ? exampleMatch[1].trim() : ''
        };
    }
    
    // 检查是否包含JSON格式
    try {
        const jsonObj = JSON.parse(text);
        if (jsonObj.translation) {
            // 如果有英文例句和中文例句字段，合并显示
            if (jsonObj.englishExample && jsonObj.chineseExample) {
                const combinedExample = `${jsonObj.englishExample}\n${jsonObj.chineseExample}`;
                return {
                    translation: jsonObj.translation,
                    example: combinedExample
                };
            }
            return {
                translation: jsonObj.translation,
                example: jsonObj.example || ''
            };
        }
    } catch (e) {
        // 不是有效的JSON，继续尝试其他格式
    }
    
    // 检查是否有明确的分隔符
    if (text.includes('翻译：') || text.includes('Translation:')) {
        const parts = text.split(/翻译：|Translation:/);
        if (parts.length > 1) {
            const translation = parts[1].split(/例句：|Example:/)[0].trim();
            const exampleMatch = text.match(/例句：|Example:/);
            const example = exampleMatch ? text.substring(exampleMatch.index + exampleMatch[0].length).trim() : '';
            
            return {
                translation: translation,
                example: example
            };
        }
    }
    
    // 默认情况：返回原始文本作为翻译，不包含例句
    return {
        translation: text.trim(),
        example: ''
    };
}

// 渲染学习记录
function renderStudyRecords() {
  // 不包含任何权限检查逻辑，所有用户都可以查看完整记录
  // recordsTable本身就是tbody元素，直接使用即可
  
  // 清空表格内容
  recordsTable.innerHTML = '';
  
  // 如果没有记录，显示空状态
  if (studyRecords.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="8" class="py-4 text-center text-gray-500">
        <div class="flex flex-col items-center justify-center">
          <i class="fa fa-book text-4xl mb-2"></i>
          <p>暂无学习记录，开始添加吧！</p>
        </div>
      </td>
    `;
    recordsTable.appendChild(emptyRow);
    return;
  }
  
  // 渲染记录
  studyRecords.forEach((record, index) => {
    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-gray-50 transition-colors';
    row.dataset.id = record.id;
    
    // 格式化时间戳
    const formattedTime = record.timestamp ? new Date(record.timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : '';
    
    row.innerHTML = `
      <td class="py-3 px-4">
        <input type="checkbox" class="record-checkbox rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
      </td>
      <td class="py-3 px-4">${index + 1}</td>
      <td class="py-3 px-4 font-medium">${escapeHTML(record.word)}</td>
      <td class="py-3 px-4">${escapeHTML(record.translation)}</td>
      <td class="py-3 px-4 text-sm text-gray-600">${escapeHTML(record.example)}</td>
      <td class="py-3 px-4 text-sm text-gray-600">${formattedTime}</td>
      <td class="py-3 px-4 text-sm text-gray-600">${escapeHTML(record.note || '-')}</td>
      <td class="py-3 px-4 text-right">
        <button class="edit-record text-blue-500 hover:text-blue-700 mr-2">
          <i class="fa fa-pencil"></i>
        </button>
        <button class="delete-record text-red-500 hover:text-red-700">
          <i class="fa fa-trash"></i>
        </button>
      </td>
    `;
    
    recordsTable.appendChild(row);
  });
  
  // 更新全选状态
  updateSelectAllState();
}

// 测试API连接函数
async function testApiConnection(provider, key) {
  // 不包含任何权限检查逻辑，所有用户都可以测试API连接
  try {
    let apiUrl = '';
    let requestData = {};
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': ''
    };
    let testTimeout = 15000; // 15秒超时

    // 根据不同的API提供商配置测试请求
    switch(provider) {
      case 'openai':
        apiUrl = 'https://api.openai.com/v1/models';
        headers.Authorization = `Bearer ${key}`;
        break;
      case 'anthropic':
        apiUrl = 'https://api.anthropic.com/v1/messages';
        headers.Authorization = `Bearer ${key}`;
        headers['anthropic-version'] = '2023-06-01';
        requestData = {
          model: 'claude-3-sonnet-20240229',
          messages: [
            { role: 'user', content: 'ping' }
          ],
          max_tokens: 10
        };
        break;
      case 'gemini':
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`;
        requestData = {
          contents: [
            {
              parts: [
                { text: 'ping' }
              ]
            }
          ]
        };
        break;
      case 'deepseek':
        apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        headers.Authorization = `Bearer ${key}`;
        // 验证并使用有效的DeepSeek模型
        const validDeepseekModels = ['deepseek-chat', 'deepseek-reasoner'];
        let deepseekModel = 'deepseek-chat'; // 默认使用标准模型
        
        // 根据用户选择的模型类型设置对应的模型名称
        if (appConfig.deepseekModelType === 'reasoner') {
          deepseekModel = 'deepseek-reasoner';
        } else if (appConfig.deepseekModelType === 'auto') {
          // 自动模式下，简化处理，统一使用标准模型
          deepseekModel = 'deepseek-chat';
        }
        
        // 确保使用有效的模型名称
        if (!validDeepseekModels.includes(deepseekModel)) {
          deepseekModel = 'deepseek-chat'; // 默认使用标准模型
        }
        
        requestData = {
          model: deepseekModel,
          messages: [
            { role: 'user', content: 'ping' }
          ],
          max_tokens: 10
        };
        break;
      default:
        return { success: false, message: `不支持的API提供商: ${provider}` };
    }

    // 创建带超时的fetch请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), testTimeout);

    try {
      // 发送测试请求
      const response = await fetch(apiUrl, {
        method: provider === 'openai' ? 'GET' : 'POST',
        headers: headers,
        body: provider === 'openai' ? undefined : JSON.stringify(requestData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMsg = `API连接失败: ${response.status} ${response.statusText}`;
        
        // 尝试获取更详细的错误信息
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMsg += ` - ${errorData.error.message}`;
          }
        } catch (e) {
          // 如果无法解析错误信息，忽略
        }
        
        return { success: false, message: errorMsg };
      }

      // 对于不同API提供商，检查响应格式是否正确
      try {
        await response.json();
        return { 
          success: true, 
          message: `${getProviderDisplayName(provider)} API连接成功` 
        };
      } catch (e) {
        return { success: false, message: 'API响应格式不正确' };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        return { success: false, message: 'API测试超时，请检查网络连接' };
      }
      
      return { success: false, message: `API测试失败: ${error.message}` };
    }
  } catch (error) {
    console.error('API连接测试过程中的错误:', error);
    return { success: false, message: `测试过程发生错误: ${error.message}` };
  }
}

// 获取API提供商显示名称
function getProviderDisplayName(provider) {
  const providerNames = {
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'gemini': 'Google Gemini',
    'deepseek': 'DeepSeek'
  };
  return providerNames[provider] || provider;
}