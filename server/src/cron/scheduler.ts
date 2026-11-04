import cron from 'node-cron';
import { prisma } from '../config/prisma.js';
import { NewsletterService } from '../services/newsletterService.js';
import { AiNewsletterService } from '../services/aiNewsletterService.js';

export function initializeCronJobs() {
  console.log('⏰ Initializing EduConnect automated background workers...');

  // Bootstrap 10-day rolling AI newsletter archive immediately on boot
  AiNewsletterService.ensureRecentTenDaysNewsletters()
    .then(async () => {
      // Check if current time in IST is >= 8:00 AM and generate today's edition if needed
      await AiNewsletterService.checkAndGenerateDaily8AmIfNeeded();
    })
    .catch((err) => {
      console.error('⚠️ [Cron Bootstrap] Failed to bootstrap 10-day AI newsletters:', err.message);
    });

  // 1. Weekly Newsletter Dispatch Job
  // Runs every Monday at 09:00 AM, checks for any scheduled newsletters
  cron.schedule(
    '0 9 * * 1',
    async () => {
      console.log('[Cron] Running weekly scheduled newsletter check...');
      try {
        const scheduledNewsletters = await prisma.newsletter.findMany({
          where: {
            status: 'SCHEDULED',
            scheduledAt: { lte: new Date() },
          },
        });

        for (const nl of scheduledNewsletters) {
          console.log(`[Cron] Auto-dispatching scheduled newsletter #${nl.editionNumber}...`);
          await NewsletterService.publishAndDispatch(nl.id);
        }
      } catch (err: any) {
        console.error('[Cron] Error executing newsletter cron job:', err.message);
      }
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );

  // 2. Job Link Health Checker Job
  // Runs once daily at midnight to probe active external career links
  cron.schedule(
    '0 0 * * *',
    async () => {
      console.log('[Cron] Running daily job listing link health check...');
      try {
        const activeJobs = await prisma.jobListing.findMany({
          where: { linkStatus: 'ACTIVE' },
          take: 50,
        });

        for (const job of activeJobs) {
          // Expiration check
          if (new Date(job.deadline) < new Date()) {
            await prisma.jobListing.update({
              where: { id: job.id },
              data: { linkStatus: 'EXPIRED' },
            });
            console.log(`[Cron] Marked job listing ${job.id} (${job.companyName}) as EXPIRED`);
          }
        }
      } catch (err: any) {
        console.error('[Cron] Error executing link health check:', err.message);
      }
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );

  // 3. Daily AI Newsletter Generation & Dispatch Job
  // Runs every day at 08:00 AM IST sharp ('0 8 * * *')
  cron.schedule(
    '0 8 * * *',
    async () => {
      console.log('🌅 [Cron 08:00 AM IST] Triggering daily AI Newsletter generation & student dispatch...');
      try {
        const edition = await AiNewsletterService.generateDailyAiNewsletter();
        console.log(`✅ [Cron 08:00 AM IST] Daily AI Newsletter Edition #${edition.editionNumber} published successfully.`);
      } catch (err: any) {
        console.error('❌ [Cron 08:00 AM IST] Error generating daily AI newsletter:', err.message);
      }
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );

  // 4. Daily AI Newsletter Catchup Worker (Runs every 10 minutes)
  // Ensures that if the server was asleep or restarted after 8:00 AM, today's 8:00 AM edition is guaranteed to be generated.
  cron.schedule(
    '*/10 * * * *',
    async () => {
      try {
        await AiNewsletterService.checkAndGenerateDaily8AmIfNeeded();
      } catch (err: any) {
        console.error('⚠️ [Cron Catchup] Error checking 8:00 AM status:', err.message);
      }
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );

  console.log('✅ Background cron workers initialized successfully (Daily 08:00 AM IST AI Newsletter + Catchup Worker active).');
}
