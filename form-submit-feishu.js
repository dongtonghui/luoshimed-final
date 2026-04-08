/**
 * 飞书机器人表单提交方案
 * 使用飞书自定义机器人接收表单通知
 */

// ============================================
// 配置信息（需要替换为你的飞书机器人Webhook）
// ============================================
const FEISHU_CONFIG = {
  // 飞书机器人Webhook地址
  // 获取方式：
  // 1. 在飞书中创建群聊
  // 2. 群设置 -> 群机器人 -> 添加机器人 -> 自定义机器人
  // 3. 复制Webhook地址
  WEBHOOK_URL: 'https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxxxxx'
};

// ============================================
// 通用表单提交函数
// ============================================
async function submitToFeishu(formData, btn) {
  if (!FEISHU_CONFIG.WEBHOOK_URL.includes('hook/')) {
    alert('请先配置飞书机器人Webhook地址！\n\n配置步骤：\n1. 在飞书创建群聊\n2. 添加自定义机器人\n3. 将Webhook地址填入配置');
    return;
  }
  
  const originalText = btn ? btn.textContent : '提交';
  
  try {
    if (btn) {
      btn.textContent = '提交中...';
      btn.disabled = true;
    }
    
    // 构建飞书消息
    const message = {
      msg_type: "interactive",
      card: {
        config: {
          wide_screen_mode: true
        },
        header: {
          title: {
            tag: "plain_text",
            content: "🎉 新询盘通知"
          },
          template: "blue"
        },
        elements: [
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**姓名：** ${formData.name || '未填写'}`
            }
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**电话：** ${formData.phone || '未填写'}`
            }
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**公司：** ${formData.company || '未填写'}`
            }
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**类型：** ${formData.type || formData.budget || '未填写'}`
            }
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**城市：** ${formData.city || '未填写'}`
            }
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**来源：** ${formData.source || '未填写'}`
            }
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**留言：**\n${formData.message || '无'}`
            }
          },
          {
            tag: "hr"
          },
          {
            tag: "note",
            elements: [
              {
                tag: "plain_text",
                content: `提交时间：${new Date().toLocaleString('zh-CN')}`
              }
            ]
          }
        ]
      }
    };
    
    // 发送到飞书
    const response = await fetch(FEISHU_CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
    
    const result = await response.json();
    
    if (result.code === 0) {
      // 发送成功
      if (btn) {
        btn.textContent = '✓ 提交成功';
        btn.style.background = '#10b981';
      }
      
      // 显示成功提示
      showStatusMessage('✓ 提交成功！我们会尽快与您联系', 'success');
      
      // 清空表单
      return true;
    } else {
      throw new Error(result.msg || '发送失败');
    }
    
  } catch (error) {
    console.error('提交失败:', error);
    
    if (btn) {
      btn.textContent = '提交失败，请重试';
      btn.style.background = '#ef4444';
    }
    
    showStatusMessage('提交失败：' + error.message + '，请直接电话联系 186-1277-9998', 'error');
    
    return false;
  } finally {
    if (btn) {
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  }
}

// ============================================
// 首页表单提交
// ============================================
async function submitHomeForm(btn) {
  const name = document.getElementById('home-name');
  const company = document.getElementById('home-company');
  const phone = document.getElementById('home-phone');
  const type = document.getElementById('home-type');
  const message = document.getElementById('home-message');
  
  // 验证
  if (!name.value.trim() || !phone.value.trim() || !type.value) {
    showStatusMessage('请填写所有必填项', 'error');
    return;
  }
  
  const formData = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    company: company?.value?.trim() || '',
    type: type.value,
    message: message?.value?.trim() || '',
    city: '',
    source: '首页分销商表单'
  };
  
  const success = await submitToFeishu(formData, btn);
  
  if (success) {
    name.value = '';
    phone.value = '';
    type.value = '';
    message.value = '';
    if (company) company.value = '';
  }
}

// ============================================
// 诊所页面表单提交
// ============================================
async function submitClinicForm(btn) {
  const name = document.getElementById('clinic-name');
  const phone = document.getElementById('clinic-phone');
  const city = document.getElementById('clinic-city');
  const budget = document.getElementById('clinic-budget');
  const message = document.getElementById('clinic-message');
  
  // 验证
  if (!name.value.trim() || !phone.value.trim() || !city.value.trim()) {
    showStatusMessage('请填写所有必填项', 'error');
    return;
  }
  
  const formData = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    company: '',
    type: '',
    budget: budget?.value || '',
    message: message?.value?.trim() || '',
    city: city.value.trim(),
    source: '诊所加盟表单'
  };
  
  const success = await submitToFeishu(formData, btn);
  
  if (success) {
    name.value = '';
    phone.value = '';
    city.value = '';
    if (budget) budget.value = '';
    if (message) message.value = '';
  }
}

// ============================================
// 联系页面表单提交
// ============================================
async function submitContactForm(btn) {
  const name = document.getElementById('cf-name');
  const phone = document.getElementById('cf-tel');
  const company = document.getElementById('cf-company');
  const type = document.getElementById('cf-type');
  const message = document.getElementById('cf-msg');
  
  // 验证
  if (!name.value.trim() || !phone.value.trim() || !type.value || !message.value.trim()) {
    showStatusMessage('请填写所有必填项', 'error');
    return;
  }
  
  const formData = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    company: company?.value?.trim() || '',
    type: type.value,
    budget: '',
    message: message.value.trim(),
    city: '',
    source: '联系我们页面'
  };
  
  const success = await submitToFeishu(formData, btn);
  
  if (success) {
    name.value = '';
    phone.value = '';
    type.value = '';
    message.value = '';
    if (company) company.value = '';
  }
}

// ============================================
// 显示状态消息
// ============================================
function showStatusMessage(message, type = 'info') {
  const statusEl = document.getElementById('form-status-message');
  if (!statusEl) return;
  
  const colors = {
    success: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    error: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    info: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' }
  };
  
  const style = colors[type] || colors.info;
  
  statusEl.textContent = message;
  statusEl.style.backgroundColor = style.bg;
  statusEl.style.color = style.text;
  statusEl.style.border = `1px solid ${style.border}`;
  statusEl.style.display = 'block';
  
  statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
