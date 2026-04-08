/**
 * 骆氏健康官网 - Google Apps Script 表单接收服务
 * CORS修复版本 - 正确处理预检请求
 */

/**
 * 处理所有请求的主入口
 */
function doPost(e) {
  // CORS响应头
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    // 检查postData
    if (!e.postData) {
      return createResponse({success: false, error: "No postData"}, headers);
    }
    
    // 解析JSON数据
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (e) {
      return createResponse({success: false, error: "Invalid JSON: " + e.message}, headers);
    }
    
    // 验证必填字段
    if (!data.name || !data.phone) {
      return createResponse({success: false, error: "Name and phone are required"}, headers);
    }
    
    // 获取表格
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 添加数据行
    sheet.appendRow([
      new Date(),                      // A: 提交时间
      data.name || "",                 // B: 姓名
      data.phone || "",                // C: 联系电话
      data.company || "",              // D: 公司
      data.type || data.budget || "",  // E: 咨询类型/预算
      data.message || "",              // F: 留言内容
      data.city || "",                 // G: 意向城市
      data.source || ""                // H: 表单来源
    ]);
    
    // 发送邮件通知
    try {
      var notificationEmail = "dong.smu@foxmail.com"; // 修改为你的邮箱
      var typeLabel = data.type || data.budget || "咨询";
      
      MailApp.sendEmail({
        to: notificationEmail,
        subject: "【骆氏健康官网 - 新询盘】" + typeLabel + (data.source ? " [" + data.source + "]" : ""),
        body: "您收到一条新的网站询盘：\n\n" +
              "提交时间：" + new Date().toLocaleString("zh-CN") + "\n" +
              "姓名：" + (data.name || "未填写") + "\n" +
              "联系电话：" + (data.phone || "未填写") + "\n" +
              "公司/机构：" + (data.company || "未填写") + "\n" +
              (data.city ? "意向城市：" + data.city + "\n" : "") +
              (data.type ? "咨询类型：" + data.type + "\n" : "") +
              (data.budget ? "可投入资金：" + data.budget + "\n" : "") +
              "留言内容：\n" + (data.message || "无") + "\n\n" +
              (data.source ? "来源页面：" + data.source + "\n" : "") +
              "---\n" +
              "此邮件由系统自动发送，请勿回复。"
      });
    } catch (emailError) {
      // 邮件发送失败不影响主流程
      console.log("邮件发送失败:", emailError);
    }
    
    // 返回成功响应
    return createResponse({
      success: true, 
      message: "提交成功",
      timestamp: new Date().toISOString()
    }, headers);
    
  } catch (error) {
    return createResponse({
      success: false, 
      error: error.toString()
    }, headers);
  }
}

/**
 * 处理GET请求（测试用）
 */
function doGet(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*"
  };
  
  return createResponse({
    status: "ok",
    message: "服务运行正常",
    timestamp: new Date().toISOString()
  }, headers);
}

/**
 * 处理OPTIONS预检请求 - 关键！
 */
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  
  var output = ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
  for (var key in headers) {
    output.setHeader(key, headers[key]);
  }
  return output;
}

/**
 * 创建JSON响应的辅助函数
 */
function createResponse(data, headers) {
  var output = ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  for (var key in headers) {
    output.setHeader(key, headers[key]);
  }
  return output;
}
