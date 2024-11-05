import MailService from "@/services/MailService";
const mailService = new MailService();

export async function handleEmailNotification(
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
