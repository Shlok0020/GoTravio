import getTransporter from '../config/mail.js';

/**
 * Send enquiry notification email using saved enquiry data from MongoDB
 * @param {Object} enquiryData - The saved enquiry object from MongoDB
 * @returns {Promise<Boolean>} - Success status
 */
export const sendEnquiryNotification = async (enquiryData) => {
  console.log('\n' + '='.repeat(60));
  console.log('📧 EMAIL NOTIFICATION PROCESS');
  console.log('='.repeat(60));
  
  try {
    // Validate enquiry data
    if (!enquiryData || !enquiryData.name || !enquiryData.phone || !enquiryData.service) {
      console.error('❌ Invalid enquiry data');
      return false;
    }

    const { name, service, phone, email, details, createdAt } = enquiryData;
    
    console.log('📊 Enquiry details:');
    console.log('- Name:', name);
    console.log('- Service:', service);
    console.log('- Phone:', phone);
    console.log('- Email:', email || 'Not provided');
    console.log('- Details:', details || 'Not provided');
    console.log('- Submitted:', new Date(createdAt).toLocaleString());

    // Get transporter
    const transporter = getTransporter();
    
    // Format date
    const enquiryDate = new Date(createdAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const senderEmail = process.env.SMTP_USER;
    const adminEmail = process.env.ADMIN_EMAIL || senderEmail;

    console.log('\n📨 Email configuration:');
    console.log('- Sender:', senderEmail);
    console.log('- Recipient:', adminEmail);

    // Email configuration
    const mailOptions = {
      from: `"Travel Service" <${senderEmail}>`,
      to: adminEmail,
      subject: `📋 ${service} - ${name}`,
      text: `
📋 NEW ENQUIRY RECEIVED

👤 CUSTOMER DETAILS:
• Name: ${name}
• Phone: ${phone}
${email ? `• Email: ${email}` : ''}
• Service: ${service}
${details ? `• Details:\n${details}` : ''}

⏰ Submitted: ${enquiryDate}

✅ This enquiry has been saved to your database.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            📋 New Travel Enquiry
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">👤 Customer Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
            <p><strong>Service:</strong> <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px;">${service}</span></p>
            ${details ? `<p><strong>Details:</strong><br><pre style="background: white; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">${details.replace(/\n/g, '<br>')}</pre></p>` : ''}
            <p><strong>Submitted:</strong> ${enquiryDate}</p>
          </div>
          
          <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; border-left: 4px solid #4CAF50;">
            <p style="margin: 0; color: #2e7d32;">
              ✅ This enquiry has been automatically saved to your database.
            </p>
          </div>
          
          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>Travel Service System • Automatic Notification</p>
            <p>Enquiry ID: ${enquiryData._id || 'N/A'}</p>
          </div>
        </div>
      `
    };

    console.log('\n🚀 Sending email...');
    console.log('Subject:', mailOptions.subject);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n🎉 EMAIL SENT SUCCESSFULLY!');
    console.log('📧 Message ID:', info.messageId);
    console.log('✅ Response:', info.response ? info.response.split('\n')[0] : 'Sent');
    console.log('📬 Delivered to:', adminEmail);
    console.log('⏰ Time:', new Date().toLocaleTimeString());
    
    return true;
    
  } catch (error) {
    console.error('\n❌ EMAIL SEND FAILED!');
    console.error('Error:', error.message);
    
    return false;
  } finally {
    console.log('='.repeat(60) + '\n');
  }
};