// Email service utility for AstuteCapital
// This is a mock implementation - replace with real email service in production

interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private static instance: EmailService
  private fromEmail: string

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || "noreply@astutecapital.com"
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendVerificationEmail(email: string, name: string, verificationUrl: string): Promise<boolean> {
    const template = this.createVerificationEmailTemplate(email, name, verificationUrl)
    return this.sendEmail(template)
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const template = this.createWelcomeEmailTemplate(email, name)
    return this.sendEmail(template)
  }

  async sendPasswordResetEmail(email: string, name: string, resetUrl: string): Promise<boolean> {
    const template = this.createPasswordResetEmailTemplate(email, name, resetUrl)
    return this.sendEmail(template)
  }

  private createVerificationEmailTemplate(email: string, name: string, verificationUrl: string): EmailTemplate {
    return {
      to: email,
      subject: "Verify Your AstuteCapital Account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your AstuteCapital Account</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 40px 30px; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                  <span style="font-size: 20px;">📈</span>
                </div>
                <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">
                  AstuteCapital
                </h1>
              </div>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 18px; font-weight: 500;">
                Premium Trading Intelligence Platform
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 50px 40px; color: #e2e8f0;">
              <h2 style="color: white; margin: 0 0 25px 0; font-size: 28px; font-weight: 600;">
                Welcome to AstuteCapital, ${name}!
              </h2>
              
              <p style="color: #cbd5e1; line-height: 1.7; margin: 0 0 25px 0; font-size: 17px;">
                Thank you for joining AstuteCapital, the premier platform for intelligent trading decisions. 
                You're just one step away from accessing our advanced AI-powered market analysis and trading signals.
              </p>
              
              <p style="color: #cbd5e1; line-height: 1.7; margin: 0 0 35px 0; font-size: 17px;">
                To activate your account and start receiving premium trading insights, please verify your email address:
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 45px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px; display: inline-block; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4); transition: all 0.3s ease;">
                  Verify Email Address
                </a>
              </div>
              
              <!-- Features Preview -->
              <div style="background: linear-gradient(135deg, #334155, #475569); padding: 35px 30px; border-radius: 16px; margin: 40px 0; border: 1px solid #475569;">
                <h3 style="color: white; margin: 0 0 20px 0; font-size: 22px; font-weight: 600; text-align: center;">
                  🚀 Your Premium Features Await
                </h3>
                <div style="display: grid; gap: 15px;">
                  <div style="display: flex; align-items: center; color: #cbd5e1; font-size: 16px;">
                    <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                    AI-powered trading signals with 89% accuracy rate
                  </div>
                  <div style="display: flex; align-items: center; color: #cbd5e1; font-size: 16px;">
                    <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                    Real-time market analysis and trend predictions
                  </div>
                  <div style="display: flex; align-items: center; color: #cbd5e1; font-size: 16px;">
                    <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                    Advanced portfolio optimization tools
                  </div>
                  <div style="display: flex; align-items: center; color: #cbd5e1; font-size: 16px;">
                    <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                    Risk management and position sizing algorithms
                  </div>
                  <div style="display: flex; align-items: center; color: #cbd5e1; font-size: 16px;">
                    <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                    Exclusive access to institutional-grade research
                  </div>
                </div>
              </div>
              
              <!-- Security Notice -->
              <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 20px; border-radius: 12px; margin: 30px 0;">
                <p style="color: #fca5a5; margin: 0; font-size: 15px; line-height: 1.6;">
                  <strong>🔒 Security Notice:</strong> This verification link will expire in 24 hours for your security. 
                  If you didn't create an AstuteCapital account, please ignore this email.
                </p>
              </div>
              
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #10b981; word-break: break-all; text-decoration: underline;">${verificationUrl}</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #0f172a; padding: 30px 40px; text-align: center; border-top: 1px solid #334155;">
              <div style="margin-bottom: 20px;">
                <h4 style="color: white; margin: 0 0 10px 0; font-size: 18px;">Need Help?</h4>
                <p style="color: #94a3b8; margin: 0; font-size: 15px;">
                  Our support team is here to help you succeed
                </p>
                <a href="mailto:support@astutecapital.com" style="color: #10b981; text-decoration: none; font-weight: 500;">
                  support@astutecapital.com
                </a>
              </div>
              
              <div style="border-top: 1px solid #334155; padding-top: 20px;">
                <p style="color: #64748b; margin: 0 0 10px 0; font-size: 13px;">
                  © 2024 AstuteCapital. All rights reserved.
                </p>
                <div style="margin-top: 15px;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terms" style="color: #10b981; text-decoration: none; margin: 0 10px; font-size: 13px;">Terms</a>
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy" style="color: #10b981; text-decoration: none; margin: 0 10px; font-size: 13px;">Privacy</a>
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/support" style="color: #10b981; text-decoration: none; margin: 0 10px; font-size: 13px;">Support</a>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to AstuteCapital!
        
        Hi ${name},
        
        Thank you for joining AstuteCapital, the premier platform for intelligent trading decisions. 
        To activate your account and start receiving premium trading insights, please verify your email address.
        
        Verify your email: ${verificationUrl}
        
        Your Premium Features:
        • AI-powered trading signals with 89% accuracy rate
        • Real-time market analysis and trend predictions
        • Advanced portfolio optimization tools
        • Risk management and position sizing algorithms
        • Exclusive access to institutional-grade research
        
        This verification link will expire in 24 hours for your security.
        If you didn't create an AstuteCapital account, please ignore this email.
        
        Need help? Contact us at support@astutecapital.com
        
        Best regards,
        The AstuteCapital Team
        
        © 2024 AstuteCapital. All rights reserved.
      `,
    }
  }

  private createWelcomeEmailTemplate(email: string, name: string): EmailTemplate {
    return {
      to: email,
      subject: "Welcome to AstuteCapital - Your Account is Active!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to AstuteCapital</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b;">
            <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 40px 30px; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                <span style="font-size: 48px; margin-right: 15px;">🎉</span>
                <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Welcome to AstuteCapital!</h1>
              </div>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 18px;">Your account is now fully active</p>
            </div>
            
            <div style="padding: 50px 40px; text-align: center; color: #e2e8f0;">
              <h2 style="color: white; margin: 0 0 25px 0; font-size: 28px;">Hi ${name},</h2>
              <p style="color: #cbd5e1; line-height: 1.7; margin: 0 0 35px 0; font-size: 18px;">
                Your email has been verified and your AstuteCapital account is now fully active! 
                You can now access all premium features and start receiving profitable trading signals.
              </p>
              
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/signals" 
                 style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px; display: inline-block; margin: 20px 0;">
                Start Trading Now
              </a>
              
              <div style="background: linear-gradient(135deg, #334155, #475569); padding: 35px 30px; border-radius: 16px; margin: 40px 0; text-align: left;">
                <h3 style="color: white; margin: 0 0 20px 0; font-size: 22px; text-align: center;">🚀 Quick Start Guide</h3>
                <ol style="color: #cbd5e1; font-size: 16px; line-height: 1.8; padding-left: 20px;">
                  <li>Explore your personalized dashboard</li>
                  <li>Set up your trading preferences</li>
                  <li>Connect your broker accounts</li>
                  <li>Start receiving AI-powered signals</li>
                  <li>Join our exclusive trader community</li>
                </ol>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    }
  }

  private createPasswordResetEmailTemplate(email: string, name: string, resetUrl: string): EmailTemplate {
    return {
      to: email,
      subject: "Reset Your AstuteCapital Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b;">
            <div style="background: #1e293b; padding: 40px 30px; text-align: center; border-bottom: 1px solid #334155;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Reset Request</h1>
              <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 16px;">AstuteCapital Security</p>
            </div>
            
            <div style="padding: 50px 40px; color: #e2e8f0;">
              <h2 style="color: white; margin: 0 0 25px 0; font-size: 24px;">Hi ${name},</h2>
              <p style="color: #cbd5e1; line-height: 1.7; margin: 0 0 30px 0; font-size: 17px;">
                We received a request to reset your AstuteCapital account password. 
                Click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" 
                   style="background: #dc2626; color: white; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 18px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 20px; border-radius: 12px; margin: 30px 0;">
                <p style="color: #fca5a5; margin: 0; font-size: 15px; line-height: 1.6;">
                  <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. 
                  If you didn't request this reset, please ignore this email and your password will remain unchanged.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    }
  }

  private async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      // Mock email sending - replace with real email service
      console.log("📧 Sending AstuteCapital email:", {
        from: this.fromEmail,
        to: template.to,
        subject: template.subject,
      })

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // In production, integrate with:
      // - SendGrid: https://sendgrid.com/
      // - AWS SES: https://aws.amazon.com/ses/
      // - Resend: https://resend.com/
      // - Postmark: https://postmarkapp.com/

      return true
    } catch (error) {
      console.error("Failed to send AstuteCapital email:", error)
      return false
    }
  }
}

export const emailService = EmailService.getInstance()
