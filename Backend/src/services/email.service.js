const nodemailer = require("nodemailer");
const axios = require("axios");

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getLeaveDetailsText = ({ leave, employee }) => {
  const employeeName = employee?.name || "Employee";
  const employeeEmail = employee?.email || "N/A";

  return `Employee: ${employeeName}
Email: ${employeeEmail}
Leave Type: ${leave.type}
From: ${formatDate(leave.fromDate)}
To: ${formatDate(leave.toDate)}
Reason: ${leave.reason}
Status: ${leave.status}`;
};

const getLeaveDetailsHtml = ({ leave, employee }) => {
  const employeeName = escapeHtml(employee?.name || "Employee");
  const employeeEmail = escapeHtml(employee?.email || "N/A");

  return `
  <p><strong>Employee:</strong> ${employeeName}</p>
  <p><strong>Email:</strong> ${employeeEmail}</p>
  <p><strong>Leave Type:</strong> ${escapeHtml(leave.type)}</p>
  <p><strong>From:</strong> ${escapeHtml(formatDate(leave.fromDate))}</p>
  <p><strong>To:</strong> ${escapeHtml(formatDate(leave.toDate))}</p>
  <p><strong>Reason:</strong> ${escapeHtml(leave.reason)}</p>
  <p><strong>Status:</strong> ${escapeHtml(leave.status)}</p>
`;
};

const sendResetPasswordEmail = async ({ email, resetLink }) => {
  const fromName = process.env.BREVO_FROM_NAME || "EMS Support";
  const fromEmail = process.env.BREVO_FROM_EMAIL;

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: fromName, email: fromEmail },
      to: [{ email }],
      subject: "Reset your EMS password",
      htmlContent: `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
  <h2 style="color: #333;">Reset Your Password</h2>
  <p>Hello,</p>
  <p>We received a request to reset your <strong>EMS</strong> account password.</p>
  <p style="margin: 25px 0;">
    <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block;">Reset Password</a>
  </p>
  <p>If the button doesn't work, copy and paste this link into your browser:</p>
  <p><a href="${resetLink}">${resetLink}</a></p>
  <p><strong>This link will expire in 15 minutes.</strong></p>
  <p>If you didn't request a password reset, you can safely ignore this email.</p>
  <hr style="margin: 25px 0;">
  <p style="color: #666; font-size: 13px;">Thanks,<br><strong>EMS Support</strong></p>
</div>
`,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    },
  );
};

const sendEmployeeInvitationEmail = async ({ email, name, setupLink }) => {
  const fromName = process.env.BREVO_FROM_NAME || "EMS Support";
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const displayName = name || "there";

  await axios.post("https://api.brevo.com/v3/smtp/email", {
    sender: { name: fromName, email: fromEmail },
    to: [{ email }],
    subject: "Welcome to EMS - set your password",
    htmlContent: `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
  <h2 style="color: #333;">Welcome to EMS</h2>

Your admin has created your employee account.

Click the link below to set your password and activate your account:
${setupLink}

This link will expire in 48 hours.
`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
  <h2 style="color: #333;">Welcome to EMS</h2>

  <p>Hello ${displayName},</p>

  <p>Your admin has created your employee account. Set your password to activate your account.</p>

  <p style="margin: 25px 0;">
    <a href="${setupLink}"
       style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block;">
      Set Password
    </a>
  </p>

  <p>If the button doesn't work, copy and paste this link into your browser:</p>

  <p>
    <a href="${setupLink}">${setupLink}</a>
  </p>

  <p><strong>This link will expire in 48 hours.</strong></p>

  <hr style="margin: 25px 0;">

  <p style="color: #666; font-size: 13px;">
    Thanks,<br>
    <strong>EMS Support</strong>
  </p>
</div>
`,
  });
};

const sendTaskAssignedEmail = async ({ email, name, taskDetails }) => {
  const fromName = process.env.BREVO_FROM_NAME || "EMS Support";
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const displayName = name || "there";
  const formattedTaskDetails = escapeHtml(taskDetails).replace(/\n/g, "<br>");

  await axios.post("https://api.brevo.com/v3/smtp/email", {
    sender: { name: fromName, email: fromEmail },
    to: [{ email }],
    subject: "Task Assigned",
    htmlContent: `
Hello ${displayName},

You have been assigned a new task:

${taskDetails}

Please log in to your EMS account to view more details.
`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
  <h2 style="color: #333;">Task Assigned</h2>

  <p>Hello ${escapeHtml(displayName)},</p>

  <p>You have been assigned a new task:</p>

  <p><strong>${formattedTaskDetails}</strong></p>

  <p>Please log in to your EMS account to view more details.</p>

  <hr style="margin: 25px 0;">

  <p style="color: #666; font-size: 13px;">
    Thanks,<br>
    <strong>EMS Support</strong>
  </p>
</div>
`,
  });
};

const sendLeaveRequestEmailToAdmin = async ({
  adminEmails,
  leave,
  employee,
}) => {
  const recipients = Array.isArray(adminEmails)
    ? adminEmails.filter(Boolean)
    : [adminEmails].filter(Boolean);

  if (!recipients.length) {
    throw new Error(
      "No admin email recipients found for leave request notification",
    );
  }

  const fromName = process.env.BREVO_FROM_NAME || "EMS Support";
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const employeeName = employee?.name || "Employee";

  await axios.post("https://api.brevo.com/v3/smtp/email", {
    sender: { name: fromName, email: fromEmail },
    to: [{ email }],
    subject: `New Leave Request - ${employeeName}`,
    htmlContent: `
Hello Admin,

A new leave request has been submitted.

${getLeaveDetailsText({ leave, employee })}

Please log in to EMS to approve or reject this request.
`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
  <h2 style="color: #333;">New Leave Request</h2>

  <p>Hello Admin,</p>
  <p>A new leave request has been submitted.</p>

  ${getLeaveDetailsHtml({ leave, employee })}

  <p>Please log in to EMS to approve or reject this request.</p>

  <hr style="margin: 25px 0;">

  <p style="color: #666; font-size: 13px;">
    Thanks,<br>
    <strong>EMS Support</strong>
  </p>
</div>
`,
  });
};

const sendLeaveStatusEmailToEmployee = async ({ leave, employee, admin }) => {
  if (!employee?.email) {
    throw new Error("No employee email found for leave status notification");
  }

  const fromName = process.env.BREVO_FROM_NAME || "EMS Support";
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const displayName = employee?.name || "there";
  const adminName = admin?.fullname
    ? `${admin.fullname.firstname || ""} ${admin.fullname.lastname || ""}`.trim()
    : "Admin";

  await axios.post("https://api.brevo.com/v3/smtp/email", {
    sender: { name: fromName, email: fromEmail },
    to: [{ email }],
    subject: `Leave Request ${leave.status}`,
    htmlContent: `
Hello ${displayName},

Your leave request has been ${leave.status.toLowerCase()} by ${adminName}.

${getLeaveDetailsText({ leave, employee })}

Please log in to EMS to view more details.
`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
  <h2 style="color: #333;">Leave Request ${escapeHtml(leave.status)}</h2>

  <p>Hello ${escapeHtml(displayName)},</p>

  <p>Your leave request has been <strong>${escapeHtml(leave.status.toLowerCase())}</strong> by ${escapeHtml(adminName)}.</p>

  ${getLeaveDetailsHtml({ leave, employee })}

  <p>Please log in to EMS to view more details.</p>

  <hr style="margin: 25px 0;">

  <p style="color: #666; font-size: 13px;">
    Thanks,<br>
    <strong>EMS Support</strong>
  </p>
</div>
`,
  });
};

const sendTaskLinkSubmittedEmailToAdmin = async ({
  adminEmails,
  task,
  employee,
  link,
  status,
}) => {
  const recipients = Array.isArray(adminEmails)
    ? adminEmails.filter(Boolean)
    : [adminEmails].filter(Boolean);

  if (!recipients.length) {
    throw new Error(
      "No admin email recipients found for task link notification",
    );
  }

  const fromName = process.env.BREVO_FROM_NAME || "EMS Support";
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const employeeName = employee?.name || "Employee";
  const employeeEmail = employee?.email || "N/A";
  const taskTitle = task?.title || "Task";
  const taskStatus = status || task?.status || "N/A";

  await axios.post("https://api.brevo.com/v3/smtp/email", {
    sender: { name: fromName, email: fromEmail },
    to: [{ email }],

    subject: `Work Link Submitted - ${employeeName}`,
    htmlContent: `
Hello Admin,

An employee has submitted a work link.

Employee: ${employeeName}
Email: ${employeeEmail}
Task: ${taskTitle}
Status: ${taskStatus}
Submitted Link: ${link}

Please log in to EMS to review the submitted work.
`,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
  <h2 style="color: #333;">Work Link Submitted</h2>

  <p>Hello Admin,</p>
  <p>An employee has submitted a work link.</p>

  <p><strong>Employee:</strong> ${escapeHtml(employeeName)}</p>
  <p><strong>Email:</strong> ${escapeHtml(employeeEmail)}</p>
  <p><strong>Task:</strong> ${escapeHtml(taskTitle)}</p>
  <p><strong>Status:</strong> ${escapeHtml(taskStatus)}</p>
  <p><strong>Submitted Link:</strong> <a href="${escapeHtml(link)}">${escapeHtml(link)}</a></p>

  <p>Please log in to EMS to review the submitted work.</p>

  <hr style="margin: 25px 0;">

  <p style="color: #666; font-size: 13px;">
    Thanks,<br>
    <strong>EMS Support</strong>
  </p>
</div>
`,
  });
};

module.exports = {
  sendResetPasswordEmail,
  sendEmployeeInvitationEmail,
  sendTaskAssignedEmail,
  sendLeaveRequestEmailToAdmin,
  sendLeaveStatusEmailToEmployee,
  sendTaskLinkSubmittedEmailToAdmin,
};
