const cron = require('node-cron');
const Quote = require('../models/Quote');

/**
 * Initialize background cron scheduler
 * Checks for quotes with status 'Scheduled' where scheduledAt <= current time
 * Runs every minute (* * * * *)
 */
const initCronJobs = () => {
  console.log('[Node-Cron] Initializing background auto-scheduler service...');

  // Schedule task to run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Find all quotes scheduled for publishing up to current time
      const pendingPublishing = await Quote.find({
        status: 'Scheduled',
        scheduledAt: { $lte: now },
      });

      if (pendingPublishing.length === 0) {
        return;
      }

      console.log(`[Node-Cron] Found ${pendingPublishing.length} scheduled post(s) ready for publishing at ${now.toLocaleTimeString()}`);

      for (const quote of pendingPublishing) {
        try {
          const targetPlatforms = quote.platforms?.length > 0 ? quote.platforms : ['LinkedIn', 'Instagram'];
          console.log(`[Auto-Publisher] Publishing Quote ID: ${quote._id} ("${quote.quote.slice(0, 30)}...") to [${targetPlatforms.join(', ')}]`);

          // Simulate social media provider API posting
          // Mark quote as Posted
          quote.status = 'Posted';
          quote.postedAt = new Date();
          await quote.save();

          console.log(`[Auto-Publisher] Successfully published Quote ID: ${quote._id}. Status set to 'Posted'.`);
        } catch (postError) {
          console.error(`[Auto-Publisher] Failed to publish Quote ID: ${quote._id}:`, postError);
          quote.status = 'Failed';
          await quote.save();
        }
      }
    } catch (error) {
      console.error('[Node-Cron] Error running background scheduler job:', error);
    }
  });
};

module.exports = initCronJobs;
