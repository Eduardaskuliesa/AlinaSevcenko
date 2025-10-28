"use server";
import transporter from "@/app/services/nodemailer";

type Lang = "lt" | "ru";

export async function sendVerificationEmail(
  email: string,
  token: string,
  lang: Lang
) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;

  const content = getEmailContent(lang, verificationLink);

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

function getEmailContent(lang: Lang, verificationLink: string) {
  switch (lang) {
    case "lt":
      return {
        subject: "Jūsų unikalus prisijungimo nuoroda",
        htmlBody: getLtHtmlBody(verificationLink),
        textBody: `Sveiki! Norėdami patvirtinti savo el. paštą, spustelėkite šią nuorodą: ${verificationLink}`,
      };
    case "ru":
      return {
        subject: "Ваша уникальная ссылка для входа",
        htmlBody: getRuHtmlBody(verificationLink),
        textBody: `Здравствуйте! Чтобы подтвердить свою электронную почту, перейдите по этой ссылке: ${verificationLink}`,
      };
  }
}

function getLtHtmlBody(verificationLink: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Patvirtinkite savo el. paštą</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #C9BDC7; font-family: Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin: 40px auto;">
        <!-- Top spacer -->
        <tr>
          <td height="25" style="height: 25px; padding: 30px;"></td>
        </tr>
        
        <tr>
          <td style="padding: 10px 30px; width: 400px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #000;">
            <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Jūsų unikali prisijungimo nuoroda</h1>
            <p style="color: #555; text-align: center; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              Prašome patvirtinti jūsų el. paštą, spustelėkite mygtuką žemiau.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #F7D09E; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Prisijungti prie paskyros</a>
            </div>
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

function getRuHtmlBody(verificationLink: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Подтвердите свою электронную почту</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #C9BDC7; font-family: Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin: 40px auto;">
        <!-- Top spacer -->
        <tr>
          <td height="25" style="height: 25px; padding: 30px;"></td>
        </tr>
        
        <tr>
          <td style="padding: 10px 30px; width: 400px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #000;">
            <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Ваша уникальная ссылка для входа</h1>
            <p style="color: #555; text-align: center; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              Пожалуйста, подтвердите вашу электронную почту, нажав на кнопку ниже.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #F7D09E; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Войти в аккаунт</a>
            </div>
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
