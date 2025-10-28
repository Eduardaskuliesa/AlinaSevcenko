"use server";

import transporter from "@/app/services/nodemailer";

type Lang = "lt" | "ru";

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  lang: Lang
) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const resetPasswordLink = `${baseUrl}/reset-password?token=${token}`;

  const content = getEmailContent(lang, resetPasswordLink);

  try {
    const info = await transporter.sendMail({
      from: `Alina Savcenko <no-reply@alinasavcenko.com>`,
      to: email,
      subject: content.subject,
      text: content.textBody,
      html: content.htmlBody,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      success: false,
      error,
    };
  }
}

function getEmailContent(lang: Lang, resetPasswordLink: string) {
  switch (lang) {
    case "lt":
      return {
        subject: "Slaptažodžio atkūrimo nuoroda",
        htmlBody: getLtHtmlBody(resetPasswordLink),
        textBody: `Sveiki! Norėdami atkurti savo slaptažodį, spustelėkite šią nuorodą: ${resetPasswordLink}`,
      };
    case "ru":
      return {
        subject: "Ссылка для восстановления пароля",
        htmlBody: getRuHtmlBody(resetPasswordLink),
        textBody: `Здравствуйте! Чтобы восстановить свой пароль, перейдите по этой ссылке: ${resetPasswordLink}`,
      };
  }
}

function getLtHtmlBody(resetPasswordLink: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Slaptažodžio atkūrimas</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #C9BDC7; font-family: Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin: 40px auto;">
        <!-- Top spacer -->
        <tr>
          <td height="25" style="height: 25px; padding: 30px;"></td>
        </tr>
        
        <tr>
          <td style="padding: 10px 30px; width: 400px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #000;">
            <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Slaptažodžio atkūrimas</h1>
            <p style="color: #555; text-align: center; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              Gavome jūsų užklausą atkurti slaptažodį. Spustelėkite mygtuką žemiau, kad sukurtumėte naują slaptažodį.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetPasswordLink}" style="background-color: #F7D09E; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Atkurti slaptažodį</a>
            </div>
            <p style="color: #777; text-align: center; font-size: 14px; margin-top: 30px;">
              Jei jūs neprašėte atkurti slaptažodžio, galite ignoruoti šį laišką.
            </p>
          </td>
        </tr>
        
        <!-- Bottom spacer -->
        <tr>
          <td height="25" style="height: 25px;  padding: 30px"></td>
        </tr>
      </table>
    </body>
    </html>
    `;
}

function getRuHtmlBody(resetPasswordLink: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Восстановление пароля</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #C9BDC7; font-family: Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin: 40px auto;">
        <!-- Top spacer -->
        <tr>
          <td height="25" style="height: 25px; padding: 30px;"></td>
        </tr>
        
        <tr>
          <td style="padding: 10px 30px; width: 400px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #000;">
            <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Восстановление пароля</h1>
            <p style="color: #555; text-align: center; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              Мы получили запрос на восстановление пароля. Нажмите на кнопку ниже, чтобы создать новый пароль.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetPasswordLink}" style="background-color: #F7D09E; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Восстановить пароль</a>
            </div>
            <p style="color: #777; text-align: center; font-size: 14px; margin-top: 30px;">
              Если вы не запрашивали восстановление пароля, вы можете проигнорировать это письмо.
            </p>
          </td>
        </tr>
        
        <!-- Bottom spacer -->
        <tr>
          <td height="25" style="height: 25px; padding: 30px"></td>
        </tr>
      </table>
    </body>
    </html>
    `;
}
