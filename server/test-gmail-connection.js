import nodemailer from 'nodemailer';

async function testGmail() {
  console.log('🧪 Testing Gmail connection...');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'vishalorisha0075@gmail.com',
      pass: 'YOUR-PASSWORD-HERE' // Replace with your password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Gmail connection successful!');
    
    const info = await transporter.sendMail({
      from: '"Test" <vishalorisha0075@gmail.com>',
      to: 'vishalorisha0075@gmail.com',
      subject: 'Gmail Test - SUCCESS',
      text: 'Gmail is working correctly!'
    });
    
    console.log('✅ Test email sent! Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
  }
}

testGmail();