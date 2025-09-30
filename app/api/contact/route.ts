import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // 检查环境变量是否存在
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_EMAIL) {
      return NextResponse.json({ success: false, message: '服务器配置错误，请联系管理员。' }, { status: 500 });
    }

    // 创建 transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 获取当前时间
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // 发送邮件
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `[联系表单] ${subject}`,
      text: `
新联系表单提交

提交时间: ${formattedDate}
提交者信息:
  姓名: ${name}
  邮箱: ${email}
  主题: ${subject}

消息内容:
${message}

------------------------------
此邮件来自网站联系表单自动发送
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>新联系表单提交</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h2 style="color: #2c3e50; margin-top: 0;">新联系表单提交</h2>
    <p style="margin-bottom: 10px;"><strong>提交时间:</strong> ${formattedDate}</p>
    
    <div style="background-color: white; border-radius: 6px; padding: 15px; border-left: 4px solid #3498db;">
      <h3 style="color: #2c3e50; margin-top: 0;">提交者信息</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 10px; font-weight: bold; width: 60px;">姓名:</td>
          <td style="padding: 5px 10px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">邮箱:</td>
          <td style="padding: 5px 10px;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">主题:</td>
          <td style="padding: 5px 10px;">${subject}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: white; border-radius: 6px; padding: 15px; margin-top: 20px; border-left: 4px solid #27ae60;">
      <h3 style="color: #2c3e50; margin-top: 0;">消息内容</h3>
      <div style="padding: 10px; background-color: #f8f9fa; border-radius: 4px; white-space: pre-wrap;">${message}</div>
    </div>
  </div>
  
  <div style="text-align: center; font-size: 12px; color: #7f8c8d; margin-top: 20px;">
    <p>此邮件来自网站联系表单自动发送</p>
  </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: '消息已成功发送！' });
  } catch (error) {
    console.error('发送邮件时出错:', error);
    return NextResponse.json({ success: false, message: '发送消息时出现错误，请稍后再试。' }, { status: 500 });
  }
}