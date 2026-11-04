import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';
import { NewsletterRepository } from '../repositories/newsletterRepository.js';
import { AuditRepository } from '../repositories/auditRepository.js';

export class NewsletterService {
  private static transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: ENV.SMTP_USER ? { user: ENV.SMTP_USER, pass: ENV.SMTP_PASS } : undefined,
  });

  static async listNewsletters(onlyPublished = true) {
    return NewsletterRepository.findAll(onlyPublished);
  }

  static async getNewsletter(id: string) {
    const nl = await NewsletterRepository.findById(id);
    if (!nl) throw new Error('Newsletter edition not found.');
    return nl;
  }

  static async publishAndDispatch(newsletterId: string, actorUserId?: string) {
    const newsletter = await NewsletterRepository.findById(newsletterId);
    if (!newsletter) throw new Error('Newsletter not found.');

    const emails = await NewsletterRepository.getSubscribedEmails();

    console.log(`📨 Dispatching Newsletter #${newsletter.editionNumber} to ${emails.length} subscribers...`);

    let sentCount = 0;
    for (const email of emails) {
      try {
        if (ENV.SMTP_USER) {
          await this.transporter.sendMail({
            from: ENV.SMTP_FROM,
            to: email,
            subject: `[EduConnect] ${newsletter.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; color: #1e293b;">
                <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 24px;">
                  <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">EduConnect Placement Dispatch</h1>
                  <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Edition #${newsletter.editionNumber} • Official Placement Cell Bulletin</p>
                </div>
                ${newsletter.contentHtml}
                <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8;">
                  You received this bulletin as a registered student of EduConnect.
                  <a href="${ENV.CLIENT_URL}/newsletter" style="color: #4f46e5;">Read past archives on portal</a>
                </div>
              </div>
            `,
          });
        }
        await NewsletterRepository.logDelivery(newsletter.id, email, 'DELIVERED');
        sentCount++;
      } catch (err: any) {
        console.error(`Failed to send to ${email}:`, err.message);
        await NewsletterRepository.logDelivery(newsletter.id, email, 'FAILED', err.message);
      }
    }

    const updated = await NewsletterRepository.update(newsletter.id, {
      status: 'PUBLISHED',
      publishedAt: new Date(),
      recipientCount: sentCount,
    });

    if (actorUserId) {
      await AuditRepository.logAction({
        actorUserId,
        action: 'PUBLISH_NEWSLETTER',
        entityType: 'NEWSLETTER',
        entityId: newsletter.id,
        metadataJson: JSON.stringify({ sentCount, totalSubscribers: emails.length }),
      });
    }

    return updated;
  }
}
