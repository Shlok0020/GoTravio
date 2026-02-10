import nodemailer from 'nodemailer';

console.log('\n' + '='.repeat(60));
console.log('📧 MAIL CONFIGURATION');
console.log('='.repeat(60));

const getTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  
  console.log('🔍 Checking email configuration:');
  console.log('SMTP_USER:', smtpUser || '❌ Not set');
  console.log('SMTP_PASSWORD:', smtpPass ? '✓ Set (' + smtpPass.length + ' chars)' : '❌ Not set');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || 465);
  console.log('SMTP_SECURE:', process.env.SMTP_SECURE === 'true');
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || smtpUser || 'Not set');
  
  if (!smtpUser || !smtpPass) {
    console.error('\n❌ Email credentials missing!');
    console.error('Check your .env file in server folder');
    
    // Return dummy transporter
    return {
      sendMail: async (mailOptions) => {
        console.log('[DUMMY] Email would be sent:', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          time: new Date().toLocaleTimeString()
        });
        return { messageId: 'dummy-' + Date.now() };
      }
    };
  }
  
  const port = parseInt(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE === 'true';
  
  console.log(`\n🔧 Creating Gmail transporter (Port: ${port}, Secure: ${secure})...`);
  
  try {
    // Correct Gmail configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: port,
      secure: secure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Test connection
    transporter.verify((error) => {
      if (error) {
        console.error('\n❌ Gmail connection failed:', error.message);
      } else {
        console.log('\n✅ Gmail connection successful!');
        console.log('✅ Ready to send emails to:', process.env.ADMIN_EMAIL || smtpUser);
      }
    });
    
    return transporter;
  } catch (error) {
    console.error('❌ Error creating transporter:', error.message);
    
    // Return dummy on error
    return {
      sendMail: async () => {
        console.log('[ERROR-FALLBACK] Email sending disabled');
        return { messageId: 'error-' + Date.now() };
      }
    };
  }
};

// Export as default
export default getTransporter;