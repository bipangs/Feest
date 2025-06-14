import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';
import { generateEmailVerificationToken } from '../utils/tokenUtils';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env['EMAIL_HOST'],
    port: parseInt(process.env['EMAIL_PORT'] || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env['EMAIL_USER'],
      pass: process.env['EMAIL_PASS']
    }
  });
};

export const sendVerificationEmail = async (email: string, firstName: string): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    // In a real application, you would get the userId and generate a proper token
    const verificationToken = generateEmailVerificationToken('user-id'); 
    const verificationUrl = `${process.env['FRONTEND_URL']}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env['EMAIL_FROM'] || `"Feest App" <${process.env['EMAIL_USER']}>`,
      to: email,
      subject: 'Welcome to Feest - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Welcome to Feest, ${firstName}!</h2>
          <p>Thank you for joining our food sharing community. To get started, please verify your email address.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            If you didn't create an account with Feest, please ignore this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendResetPasswordEmail = async (email: string, firstName: string, resetToken: string): Promise<void> => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env['FRONTEND_URL']}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env['EMAIL_FROM'] || `"Feest App" <${process.env['EMAIL_USER']}>`,
      to: email,
      subject: 'Feest - Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B6B;">Reset Your Password</h2>
          <p>Hi ${firstName},</p>
          <p>We received a request to reset your password for your Feest account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #FF6B6B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            For security reasons, this link can only be used once.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendSwapNotificationEmail = async (
  email: string, 
  firstName: string, 
  foodTitle: string, 
  requesterName: string
): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env['EMAIL_FROM'] || `"Feest App" <${process.env['EMAIL_USER']}>`,
      to: email,
      subject: `New Swap Request for "${foodTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">New Swap Request!</h2>
          <p>Hi ${firstName},</p>
          <p><strong>${requesterName}</strong> is interested in your food listing: <strong>"${foodTitle}"</strong></p>
          <p>Open the Feest app to view the request and respond to ${requesterName}.</p>
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666;">Open the Feest app to manage your swap requests</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Happy sharing! 🍀
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Swap notification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending swap notification email:', error);
    // Don't throw error for notification emails - they're not critical
  }
};
