import dotenv from 'dotenv';
import { InMemoryRunner, stringifyContent } from '@google/adk';
import { rootAgent } from './agent.js';
import { sendReport } from './notifier.js';

dotenv.config();

const requiredEnvVars = ['GEMINI_API_KEY', 'TELEGRAM_BOT_TOKEN'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'CRITICAL ERROR: Missing environment variables!');
  console.error('\x1b[33m%s\x1b[0m', `The following variables must be set in your environment: ${missingVars.join(', ')}`);
  process.exit(1);
}

async function runAgent() {
  console.log('Running Technology Curator Agent...');
  const runner = new InMemoryRunner({
    appName: 'tech-curator',
    agent: rootAgent,
  });

  const events = runner.runEphemeral({
    userId: 'system-scheduler',
    newMessage: { parts: [{ text: 'Gere o relatório de tendências tecnológicas da semana conforme suas instruções.' }] },
  });

  let finalContent = '';
  for await (const event of events) {
    const content = stringifyContent(event);
    if (content) {
      finalContent += content;
    }
  }

  if (finalContent) {
    await sendReport(finalContent);
    return true;
  }
  return false;
}

async function main() {
  try {
    const success = await runAgent();
    if (success) {
      console.log('Agent run and notification completed successfully.');
      process.exit(0);
    } else {
      console.error('Agent did not generate a final response.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during agent execution:', error);
    process.exit(1);
  }
}

main();
