// mailer.js
// Cần cài thư viện: npm install nodemailer
import nodemailer from "nodemailer";
import "dotenv/config";

// Dùng đúng SMTP_USER / SMTP_PASS đã có sẵn trên Render (Gmail App Password)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true cho port 465, false cho port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Gửi email chứa mã OTP đặt lại mật khẩu
 * @param {string} toEmail - Email người nhận (tài khoản khách hàng/admin cần khôi phục)
 * @param {string} code - Mã OTP 6 số
 */
export async function sendResetCodeEmail(toEmail, code) {
  const mailOptions = {
    from: `"Booking Support" <${process.env.SMTP_USER}>`,
    to: toEmail, // Có thể là bất kỳ email nào — không cần trùng với SMTP_USER
    subject: "Mã xác nhận khôi phục mật khẩu",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e9f0; border-radius: 12px;">
        <h2 style="color: #003580; margin-bottom: 8px;">Khôi phục mật khẩu</h2>
        <p style="color: #555; font-size: 14px;">
          Bạn vừa yêu cầu đặt lại mật khẩu. Dùng mã xác nhận bên dưới để tiếp tục:
        </p>
        <div style="background: #f4f6fb; text-align: center; padding: 16px; border-radius: 10px; margin: 16px 0;">
          <span style="font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #ef5b25;">
            ${code}
          </span>
        </div>
        <p style="color: #888; font-size: 13px;">
          Mã có hiệu lực trong <strong>10 phút</strong>. Nếu bạn không yêu cầu việc này, vui lòng bỏ qua email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export default transporter;
