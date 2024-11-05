// services/MailService.ts
import nodemailer from "nodemailer";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const settingService = new SettingService();

export default class MailService {
  private transporter: nodemailer.Transporter | undefined;
  private adminEmail: string | undefined;

  constructor() {
    this.init();
  }

  // Initialize email transporter with settings from the database
  private async init() {
    const gmailUserSetting = await settingService.getSettingByKey(
      SETTINGS_KEYS.GMAIL_USER
    );
    const gmailPasswordSetting = await settingService.getSettingByKey(
      SETTINGS_KEYS.GMAIL_PASSWORD
    );
    const adminEmailSetting = await settingService.getSettingByKey(
      SETTINGS_KEYS.ADMIN_EMAIL
    );

    const gmailUser = gmailUserSetting?.value;
    const gmailPassword = gmailPasswordSetting?.value;
    this.adminEmail = adminEmailSetting?.value;

    if (gmailUser && gmailPassword && this.adminEmail) {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPassword,
        },
      });
    } else {
      console.error("Email configuration is incomplete.");
    }
  }

  // Send email
  public async sendMail(
    subject: string,
    text: string,
    attachments?: nodemailer.Attachment[]
  ) {
    if (!this.transporter || !this.adminEmail) {
      console.error("Email configuration is incomplete.");
      throw new Error("Email configuration is incomplete.");
    }

    const mailOptions = {
      from: this.transporter.options.auth?.user,
      to: this.adminEmail,
      subject,
      text,
      attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}
