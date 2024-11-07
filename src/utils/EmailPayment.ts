import { User } from "@/models/UserModel";
import MailService from "@/services/MailService";
const mailService = new MailService();

export async function EmailPayment(
  user: User,
  amount: number,
  currency: string,
  screenshot: Buffer
): Promise<boolean> {
  const mailSubject = "New Offline Top-up Request";
  const mailText = `
    User requested a top-up:
    - Name: ${user.name}
    - Username: ${user.username}
    - Email: ${user.email}
    - User ID: ${user._id}
    - Amount: ${amount} ${currency}
    (Offline).
  `;

  const attachments = [
    {
      filename: "screenshot.png",
      content: screenshot,
    },
  ];

  try {
    const response = await mailService.sendMail(
      mailSubject,
      mailText,
      attachments
    );
    console.log(`Email sent successfully for user ${user.id}:`, response);
    return true;
  } catch (error) {
    console.error(`Failed to send email for user ${user.id}:`, error);
    return false;
  }
}

export default async function notifyViaEmail(
  user: User,
  amount: number,
  currency: string,
  screenshotBuffer: Buffer
): Promise<boolean> {
  try {
    const emailResponse = await EmailPayment(
      user,
      amount,
      currency,
      screenshotBuffer
    );

    if (emailResponse) {
      console.log("Email notification sent successfully:", emailResponse);
      return true;
    } else {
      console.warn("Email notification returned an unexpected response.");
      return false;
    }
  } catch (error) {
    console.error("Email notification failed:", error);
    return false;
  }
}
