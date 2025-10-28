"use server";

import transporter from "@/app/services/nodemailer";

type Lang = "lt" | "ru";

interface ExpiryReminderEmailParams {
  email: string;
  courseTitle: string;
  courseSlug: string;
  lang: Lang;
  daysUntilExpiry: 1 | 7;
}

export async function sendExpiryReminder({
  email,
  courseTitle,
  courseSlug,
  lang,
  daysUntilExpiry,
}: ExpiryReminderEmailParams) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const courseLink = `${baseUrl}/my-courses/courses`;
  const extendLink = `${baseUrl}/courses/${courseSlug}`;

  const content = getEmailContent(
    lang,
    courseTitle,
    courseLink,
    extendLink,
    daysUntilExpiry
  );

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
    console.error("Error sending expiry reminder email:", error);
    return {
      success: false,
      error,
    };
  }
}

function getEmailContent(
  lang: Lang,
  courseTitle: string,
  courseLink: string,
  extendLink: string,
  daysUntilExpiry: 1 | 7
) {
  if (daysUntilExpiry === 7) {
    return lang === "lt"
      ? get7DayLtContent(courseTitle, courseLink, extendLink)
      : get7DayRuContent(courseTitle, courseLink, extendLink);
  } else {
    return lang === "lt"
      ? get1DayLtContent(courseTitle, courseLink, extendLink)
      : get1DayRuContent(courseTitle, courseLink, extendLink);
  }
}

function get7DayRuContent(
  courseTitle: string,
  courseLink: string,
  extendLink: string
) {
  return {
    subject: "Ваш доступ к курсу истекает через 7 дней",
    htmlBody: get7DayRuHtmlBody(courseTitle, courseLink, extendLink),
    textBody: `Здравствуйте, Напоминаю, что ваш доступ к курсу «${courseTitle}» истекает через 7 дней. У вас ещё есть время завершить программу и вернуться к материалам, которые вам важны. Продолжить обучение: ${courseLink}. Продлить доступ: ${extendLink}. — Alina`,
  };
}

function get1DayRuContent(
  courseTitle: string,
  courseLink: string,
  extendLink: string
) {
  return {
    subject: "Ваш доступ к курсу истекает завтра",
    htmlBody: get1DayRuHtmlBody(courseTitle, courseLink, extendLink),
    textBody: `Здравствуйте, Ваш доступ к курсу «${courseTitle}» истекает завтра. Это последняя возможность завершить программу. Перейти к курсу: ${courseLink}. Продлить доступ: ${extendLink}. — Alina`,
  };
}

function get7DayLtContent(
  courseTitle: string,
  courseLink: string,
  extendLink: string
) {
  return {
    subject: "Jūsų prieiga prie kurso baigiasi po 7 dienų",
    htmlBody: get7DayLtHtmlBody(courseTitle, courseLink, extendLink),
    textBody: `Sveiki, Primenu, kad jūsų prieiga prie kurso „${courseTitle}" baigiasi po 7 dienų. Dar turite laiko užbaigti programą ir sugrįžti prie jums svarbios medžiagos. Tęsti mokymąsi: ${courseLink}. Pratęsti prieigą: ${extendLink}. — Alina`,
  };
}

function get1DayLtContent(
  courseTitle: string,
  courseLink: string,
  extendLink: string
) {
  return {
    subject: "Jūsų prieiga prie kurso baigiasi rytoj",
    htmlBody: get1DayLtHtmlBody(courseTitle, courseLink, extendLink),
    textBody: `Sveiki, Jūsų prieiga prie kurso „${courseTitle}" baigiasi rytoj. Tai paskutinė galimybė užbaigti programą. Eiti į kursą: ${courseLink}. Pratęsti prieigą: ${extendLink}. — Alina`,
  };
}

function get7DayRuHtmlBody(
  courseTitle: string,
  courseLink: string,
  extendLink: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Напоминание о курсе</title>
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
              Напоминаю, что ваш доступ к курсу «${courseTitle}» истекает через 7 дней.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              У вас ещё есть время завершить программу и вернуться к материалам, которые вам важны.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${courseLink}" style="background-color: #F7D09E; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block; margin-bottom: 10px;">Продолжить обучение</a>
              <br>
              <a href="${extendLink}" style="background-color: transparent; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block; border: 2px solid #333;">Продлить доступ</a>
            </div>
            
            <p style="color: #333; font-size: 14px; margin-top: 30px; text-align: right;">
              — Alina
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

function get1DayRuHtmlBody(
  courseTitle: string,
  courseLink: string,
  extendLink: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Последний день доступа</title>
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
              Ваш доступ к курсу «${courseTitle}» истекает завтра.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Это последняя возможность завершить программу.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${courseLink}" style="background-color: #F7D09E; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block; margin-bottom: 10px;">Перейти к курсу</a>
              <br>
              <a href="${extendLink}" style="background-color: transparent; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block; border: 2px solid #333;">Продлить доступ</a>
            </div>
            
            <p style="color: #333; font-size: 14px; margin-top: 30px; text-align: right;">
              — Alina
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

function get7DayLtHtmlBody(
  courseTitle: string,
  courseLink: string,
  extendLink: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Priminimas apie kursą</title>
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
              Primenu, kad jūsų prieiga prie kurso „${courseTitle}" baigiasi po 7 dienų.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Dar turite laiko užbaigti programą ir sugrįžti prie jums svarbios medžiagos.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${courseLink}" style="background-color: #F7D09E; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block; margin-bottom: 10px;">Tęsti mokymąsi</a>
              <br>
              <a href="${extendLink}" style="background-color: transparent; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block; border: 2px solid #333;">Pratęsti prieigą</a>
            </div>
            
            <p style="color: #333; font-size: 14px; margin-top: 30px; text-align: right;">
              — Alina
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

function get1DayLtHtmlBody(
  courseTitle: string,
  courseLink: string,
  extendLink: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Paskutinė diena</title>
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
              Jūsų prieiga prie kurso „${courseTitle}" baigiasi rytoj.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Tai paskutinė galimybė užbaigti programą.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${courseLink}" style="background-color: #F7D09E; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block; margin-bottom: 10px;">Eiti į kursą</a>
              <br>
              <a href="${extendLink}" style="background-color: transparent; color: #333; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block; border: 2px solid #333;">Pratęsti prieigą</a>
            </div>
            
            <p style="color: #333; font-size: 14px; margin-top: 30px; text-align: right;">
              — Alina
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
