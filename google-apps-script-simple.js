/**
 * 骆氏健康官网 - Google Apps Script 表单接收服务
 * 简化版本 - 不使用setHeader
 */

function doGet(e) {
  var output = ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "服务运行正常",
    timestamp: new Date().toISOString()
  }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function doPost(e) {
  try {
    if (!e.postData) {
      var errOutput = ContentService.createTextOutput(JSON.stringify({
        success: false, 
        error: "No postData"
      }));
      errOutput.setMimeType(ContentService.MimeType.JSON);
      return errOutput;
    }
    
    var data = JSON.parse(e.postData.contents);
    
    if (!data.name || !data.phone) {
      var errOutput2 = ContentService.createTextOutput(JSON.stringify({
        success: false, 
        error: "Name and phone required"
      }));
      errOutput2.setMimeType(ContentService.MimeType.JSON);
      return errOutput2;
    }
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.phone || "",
      data.company || "",
      data.type || data.budget || "",
      data.message || "",
      data.city || "",
      data.source || ""
    ]);
    
    // 发送邮件通知
    try {
      var notificationEmail = "your-email@example.com";
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
      console.log("邮件发送失败:", emailError);
    }
    
    var successOutput = ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "提交成功",
      timestamp: new Date().toISOString()
    }));
    successOutput.setMimeType(ContentService.MimeType.JSON);
    return successOutput;
    
  } catch (error) {
    var errorOutput = ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }));
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    return errorOutput;
  }
}

function doOptions(e) {
  var output = ContentService.createTextOutput("");
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}
