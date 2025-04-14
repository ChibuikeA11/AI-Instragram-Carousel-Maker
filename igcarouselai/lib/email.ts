import config from './config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // For development, just log the email
  if (process.env.NODE_ENV === 'development') {
    console.log('Email would be sent in production:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Content:', html);
    return;
  }

  // TODO: Implement your email service integration here
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@your-domain.com',
  //   to,
  //   subject,
  //   html,
  // });
}

export function generatePasswordResetEmail(
  email: string,
  token: string
): EmailOptions {
  const resetUrl = `${config.app.url}/reset-password?token=${token}`;

  return {
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
        
        <p>Hello,</p>
        
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p>If you didn't request this password reset, you can safely ignore this email. The link will expire in 1 hour.</p>
        
        <p>For security reasons, this link can only be used once. If you need to reset your password again, please request a new link.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          If the button above doesn't work, copy and paste this URL into your browser:<br>
          <span style="color: #4F46E5;">${resetUrl}</span>
        </p>
      </div>
    `
  };
}