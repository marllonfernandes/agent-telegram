import dotenv from 'dotenv';
import { startScheduler, runAgentAndNotify } from './scheduler.js';

dotenv.config();

const requiredEnvVars = ['GEMINI_API_KEY', 'TELEGRAM_BOT_TOKEN'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'CRITICAL ERROR: Missing environment variables!');
  console.error('\x1b[33m%s\x1b[0m', `The following variables must be set in your .env file: ${missingVars.join(', ')}`);
  console.error('Please check .env.example for guidance.\n');
  if (!process.argv.includes('--now')) {
    process.exit(1);
  }
}

// Optional warning for chat IDs
if (!process.env.TELEGRAM_CHAT_ID && !process.env.TELEGRAM_GROUP_ID) {
  console.warn('\x1b[33m%s\x1b[0m', 'Warning: Neither TELEGRAM_CHAT_ID nor TELEGRAM_GROUP_ID is set. The bot will have nowhere to send the report.');
}

const isDryRun = process.argv.includes('--dry-run');
const isImmediate = process.argv.includes('--now');

if (isDryRun || isImmediate) {
  console.log('Executing immediate run...');
  runAgentAndNotify().then(() => {
    if (isDryRun) process.exit(0);
  });
}

if (!isDryRun) {
  startScheduler();
}
