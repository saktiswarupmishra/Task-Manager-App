import nodemailer from 'nodemailer';

let transporter = null;

const initTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('📧 Email transporter configured');
  } else {
    console.log('📧 SMTP not configured — emails will be logged to console');
  }
};

const sendEmail = async (to, subject, html) => {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@taskmanager.com',
        to,
        subject,
        html,
      });
      console.log(`📧 Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error(`❌ Email failed to ${to}:`, error.message);
    }
  } else {
    console.log(`📧 [Console Email] To: ${to} | Subject: ${subject}`);
    console.log(`📧 [Console Email] Body: ${html}`);
  }
};

const sendDueReminder = async (task, userEmail) => {
  const subject = `⏰ Task Due Reminder: "${task.title}"`;
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #1a1d2e; color: #e2e8f0; border-radius: 12px;">
      <h2 style="color: #3b82f6; margin-bottom: 16px;">⏰ Task Due Soon</h2>
      <div style="background: #252840; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h3 style="color: #f1f5f9; margin: 0 0 8px 0;">${task.title}</h3>
        <p style="color: #94a3b8; margin: 0 0 8px 0;">${task.description || 'No description'}</p>
        <p style="color: #f59e0b; margin: 0; font-weight: 600;">Due: ${new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <p style="color: #64748b; font-size: 12px; margin: 0;">— Task Manager App</p>
    </div>
  `;
  await sendEmail(userEmail, subject, html);
};

const sendTaskCompleted = async (task, userEmail) => {
  const subject = `✅ Task Completed: "${task.title}"`;
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #1a1d2e; color: #e2e8f0; border-radius: 12px;">
      <h2 style="color: #10b981; margin-bottom: 16px;">✅ Task Completed!</h2>
      <div style="background: #252840; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h3 style="color: #f1f5f9; margin: 0 0 8px 0;">${task.title}</h3>
        <p style="color: #94a3b8; margin: 0;">Great job on completing this task!</p>
      </div>
      <p style="color: #64748b; font-size: 12px; margin: 0;">— Task Manager App</p>
    </div>
  `;
  await sendEmail(userEmail, subject, html);
};

export { initTransporter, sendDueReminder, sendTaskCompleted };
