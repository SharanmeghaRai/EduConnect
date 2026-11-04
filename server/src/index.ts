import { app } from './app.js';
import { ENV } from './config/env.js';
import { initializeCronJobs } from './cron/scheduler.js';

const server = app.listen(ENV.PORT, () => {
  console.log('====================================================');
  console.log(`🚀 EduConnect API Server (Tier 2) running on port ${ENV.PORT}`);
  console.log(`📍 Health Endpoint: http://localhost:${ENV.PORT}/api/v1/health`);
  console.log(`🔒 Mode: ${ENV.NODE_ENV}`);
  console.log('====================================================');

  // Launch background tasks
  initializeCronJobs();
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
