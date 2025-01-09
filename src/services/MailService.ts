import nodemailer from "nodemailer";
import SettingService from "@/services/SettingService";
import {
  Mail_SETTINGS_TYPES,
  MAIL_SERVICE_KEYS,
} from "@/config/settings/MAIL_SERVICE_KEYS";
import { SettingsInterface } from "@/config/settingKeys";

const settingService = new SettingService();

export default class MailService {
  private transporter: nodemailer.Transporter | undefined;
  private adminEmail: string | undefined;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const settings = (await settingService.getAllSettings(
        "production"
      )) as SettingsInterface;

      this.adminEmail = settings[MAIL_SERVICE_KEYS.ADMIN_EMAIL];

      if (
        settings[MAIL_SERVICE_KEYS.GMAIL]?.user &&
        settings[MAIL_SERVICE_KEYS.GMAIL]?.password
      ) {
        this.transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: settings[MAIL_SERVICE_KEYS.GMAIL].user,
            pass: settings[MAIL_SERVICE_KEYS.GMAIL].password,
          },
        });
      } else if (
        settings[MAIL_SERVICE_KEYS.OUTLOOK]?.user &&
        settings[MAIL_SERVICE_KEYS.OUTLOOK]?.password
      ) {
        this.transporter = nodemailer.createTransport({
          service: "outlook",
          auth: {
            user: settings[MAIL_SERVICE_KEYS.OUTLOOK].user,
            pass: settings[MAIL_SERVICE_KEYS.OUTLOOK].password,
          },
        });
      } else if (settings[MAIL_SERVICE_KEYS.SENDGRID]?.apiKey) {
        this.transporter = nodemailer.createTransport({
          service: "SendGrid",
          auth: {
            api_key: settings[MAIL_SERVICE_KEYS.SENDGRID].apiKey,
          },
        });
      } else {
        console.error("Email configuration is incomplete.");
      }
    } catch (error) {
      console.error("Error initializing mail service:", error);
    }
  }

  public async sendMail(
    subject: string,
    text: string,
    attachments?: nodemailer.Attachment[]
  ) {
    if (!this.transporter || !this.adminEmail) {
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
