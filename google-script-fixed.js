/**
 * 骆氏健康官网 - Google Apps Script 表单接收服务
 * 修复版本 - 优化CORS处理和错误处理
 */

/**
 * 处理表单提交的 POST 请求
 */
function doPost(e) {
  // 设置 CORS 响应头，允许跨域请求
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  try {
    // 检查是否有postData
    if (!e.postData || !e.postData.contents) {
      console.error('没有收到postData');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: '没有收到数据'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }
    
    // 解析请求数据
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      console.error('JSON解析错误:', parseError);
      console.error('收到的内容:', e.postData.contents);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: '数据格式错误: ' + parseError.message
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }
    
    console.log('收到的数据:', data);
    
    // 验证必填字段
    if (!data.name || !data.phone) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: '姓名和电话为必填项'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }
    
    // 获取当前活动的表格
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('无法访问电子表格');
    }
    
    const sheet = spreadsheet.getActiveSheet();
    if (!sheet) {
      throw new Error('无法访问工作表');
    }
    
    // 添加数据行
    sheet.appendRow([
      new Date(),                      // A: 提交时间
      data.name || '',                 // B: 姓名
      data.phone || '',                // C: 联系电话
      data.company || '',              // D: 公司
      data.type || data.budget || '',  // E: 咨询类型/预算
      data.message || '',              // F: 留言内容
      data.city || '',                 // G: 意向城市
      data.source || ''                // H: 表单来源
    ]);
    
    console.log('数据已成功写入表格');
    
    // 发送邮件通知（可选）
    try {
      const notificationEmail = 'your-email@example.com'; // 修改为你的邮箱
      const typeLabel = data.type || data.budget || '咨询';
      
      MailApp.sendEmail({
        to: notificationEmail,
        subject: '【骆氏健康官网 - 新询盘】' + typeLabel + (data.source ? ` [${data.source}]` : ''),
        body: `您收到一条新的网站询盘：\n\n` +
              `提交时间：${new Date().toLocaleString('zh-CN')}\n` +
              `姓名：${data.name || '未填写'}\n` +
              `联系电话：${data.phone || '未填写'}\n` +
              `公司/机构：${data.company || '未填写'}\n` +
              (data.city ? `意向城市：${data.city}\n` : '') +
              (data.type ? `咨询类型：${data.type}\n` : '') +
              (data.budget ? `可投入资金：${data.budget}\n` : '') +
              `留言内容：\n${data.message || '无'}\n\n` +
              (data.source ? `来源页面：${data.source}\n` : '') +
              `---\n` +
              `此邮件由系统自动发送，请勿回复。`
      });
      console.log('邮件通知已发送');
    } catch (emailError) {
      // 邮件发送失败不影响主流程
      console.log('邮件发送失败:', emailError);
    }
    
    // 返回成功响应
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: '提交成功',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
    
  } catch (error) {
    // 返回错误响应
    console.error('处理请求时出错:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message || '服务器内部错误'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

/**
 * 处理 GET 请求（用于测试）
 */
function doGet(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*'
  };
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: '表单服务运行正常',
    timestamp: new Date().toISOString()
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders(headers);
}

/**
 * 处理 OPTIONS 预检请求（CORS）
 */
function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
  
  return ContentService.createTextOutput('')
    .setHeaders(headers);
}
