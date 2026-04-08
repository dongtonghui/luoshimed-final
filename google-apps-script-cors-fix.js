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
  
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

/**
 * 创建JSON响应的辅助函数
 */
function createResponse(data, headers) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}
