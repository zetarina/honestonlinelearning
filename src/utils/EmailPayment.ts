import MailService from "@/services/MailService";
const mailService = new MailService();

export async function EmailPayment(
  userId: string,
  amount: number,
  currency: string,
  screenshot: Buffer
) {
  const mailSubject = "New Offline Top-up Request";
  const mailText = `User with ID: ${userId} requested a top-up of ${amount} ${currency}.`;

  const attachments = [
    {
      filename: "screenshot.png",
      content: screenshot,
    },
  ];

  return mailService.sendMail(mailSubject, mailText, attachments);
}
export default async function notifyViaEmail(
  userId,
  amount,
  currency,
  screenshotBuffer
) {
  try {
    const emailResponse = await EmailPayment(
      userId,
      parseFloat(amount),
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
