import transporter from "@/app/services/nodemailer";

interface SendCartReminderParams {
  email: string;
  language: "lt" | "ru";
}
type Lang = "lt" | "ru";

export async function sendCartReminder({
  email,
  language,
}: SendCartReminderParams) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const cartLink = `${baseUrl}/cart`;
  const content = getEmailContent(language, cartLink);
  try {
    const info = await transporter.sendMail({
      from: `Alina Savcenko <info@alinasavcenko.com>`,
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
    console.error("Error sending cart reminder email:", error);
    return {
      success: false,
      error,
    };
  }
}

function getEmailContent(lang: Lang, cartLink: string) {
  switch (lang) {
    case "lt":
      return {
        subject: "Esu čia, kad padėčiau jums",
        htmlBody: getLtHtmlBody(cartLink),
        textBody: `Sveiki, Pastebėjau, kad dar neapsisprendėte dėl savo pasirinkimo. Pirmas žingsnis dažnai būna sunkiausias, bet atminkite — kelias į save prasideda būtent nuo jo. Grįžkite prie pasirinkimo: ${cartLink}. — Alina`,
      };
    case "ru":
      return {
        subject: "Я здесь, чтобы помочь вам",
        htmlBody: getRuHtmlBody(cartLink),
        textBody: `Здравствуйте, Я заметила, что вы не определились со своим выбором. Первый шаг часто самый сложный, но помните — путь к себе начинается именно с него. Вернуться к выбору: ${cartLink}. — Alina`,
      };
  }
}

function getLtHtmlBody(cartLink: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Priminimas apie krepšelį</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #C9BDC7; font-family: Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin: 40px auto;">
        <tr>
          <td height="25" style="height: 25px; padding: 30px;"></td>
        </tr>
        
        <tr>
          <td style="padding: 30px; width: 400px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #000;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Sveiki,</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Pastebėjau, kad dar neapsisprendėte dėl savo pasirinkimo.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Pirmas žingsnis dažnai būna sunkiausias, bet atminkite — kelias į save prasideda būtent nuo jo.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${cartLink}" style="background-color: #F7D09E; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Grįžti prie pasirinkimo</a>
            </div>
            
            <p style="color: #777; font-size: 14px; margin-top: 30px;">
              <span style="color: #333;"> Alina</span>
            </p>
          </td>
        </tr>
        
        <tr>
          <td height="25" style="height: 25px; padding: 30px"></td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function getRuHtmlBody(cartLink: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Напоминание о корзине</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #C9BDC7; font-family: Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin: 40px auto;">
        <tr>
          <td height="25" style="height: 25px; padding: 30px;"></td>
        </tr>
        
        <tr>
          <td style="padding: 30px; width: 400px; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #000;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Здравствуйте,</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Я заметила, что вы не определились со своим выбором.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Первый шаг часто самый сложный, но помните — путь к себе начинается именно с него.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${cartLink}" style="background-color: #F7D09E; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Вернуться к выбору</a>
            </div>
            
            <p style="color: #777; font-size: 14px; margin-top: 30px;">
              <span style="color: #333;">Alina</span>
            </p>
          </td>
        </tr>
        
        <tr>
          <td height="25" style="height: 25px; padding: 30px"></td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
