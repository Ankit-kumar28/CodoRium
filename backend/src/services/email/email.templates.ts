export function passwordResetEmailTemplate({
  firstName,
  resetUrl,
}: {
  firstName: string;
  resetUrl: string;
}) {
  return {
    subject: "Reset your CodoRium password",

    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Reset Password</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#F8FAFC;
    font-family:Arial, sans-serif;
  "
>

  <div
    style="
      max-width:600px;
      margin:40px auto;
      background:#FFFFFF;
      border-radius:12px;
      overflow:hidden;
      border:1px solid #E2E8F0;
    "
  >

    <div
      style="
        background:#0F172A;
        padding:24px;
        text-align:center;
      "
    >
      <h1
        style="
          color:#FFFFFF;
          margin:0;
          font-size:28px;
        "
      >
        CodoRium
      </h1>
    </div>

    <div
      style="
        padding:32px;
        color:#0F172A;
      "
    >

      <h2>
        Reset your password
      </h2>

      <p>
        Hello ${firstName},
      </p>

      <p>
        We received a request to reset
        your CodoRium account password.
      </p>

      <p>
        Click the button below to create
        a new password.
      </p>

      <div
        style="
          text-align:center;
          margin:32px 0;
        "
      >

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:14px 24px;
            background:#F97316;
            color:#FFFFFF;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Reset Password
        </a>

      </div>

      <p>
        This link will expire in
        30 minutes.
      </p>

      <p>
        If you did not request a password
        reset, you can safely ignore this
        email.
      </p>

      <hr
        style="
          border:none;
          border-top:1px solid #E2E8F0;
          margin:30px 0;
        "
      />

      <p
        style="
          font-size:12px;
          color:#64748B;
        "
      >
        This is an automated email from
        CodoRium. Please do not reply.
      </p>

    </div>

  </div>

</body>
</html>
`,
  };
}

export function credentialsEmailTemplate({
  firstName,
  temporaryPassword,
  roles,
}: {
  firstName: string;
  temporaryPassword: string;
  roles: string[];
}) {
  return {
    subject: "Your credentials for CodoRium",
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a">
  <div style="max-width:600px;margin:40px auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
    <div style="background:#0f172a;padding:24px;text-align:center;color:#fff">
      <h1 style="margin:0">CodoRium</h1>
    </div>
    <div style="padding:32px">
      <h2>Your credentials for CodoRium</h2>
      <p>Hello ${firstName},</p>
      <p>Your CodoRium account has been created by the college administration.</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;line-height:1.8">
        <strong>Email:</strong> ${toSafeText("EMAIL_PLACEHOLDER")}<br />
        <strong>Temporary password:</strong> ${toSafeText(temporaryPassword)}<br />
        <strong>Roles:</strong> ${toSafeText(roles.join(", "))}
      </div>
      <p style="margin-top:24px">Please sign in and change this temporary password immediately.</p>
      <p style="font-size:12px;color:#64748b">This is an automated email from CodoRium.</p>
    </div>
  </div>
</body>
</html>
`,
  };
}

function toSafeText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}