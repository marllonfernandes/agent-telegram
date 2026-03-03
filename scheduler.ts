import cron from 'node-cron';
import { InMemoryRunner, stringifyContent, isFinalResponse } from '@google/adk';
import { rootAgent } from './agent.js';
import { sendReport } from './notifier.js';

export async function runAgentAndNotify() {
  console.log('Running Technology Curator Agent...');
  try {
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
      console.log('Agent run and notification completed successfully.');
    } else {
      console.warn('Agent did not generate a final response.');
    }
  } catch (error) {
    console.error('Error during agent execution or notification:', error);
  }
}

export function startScheduler() {
  // Cron for Fridays at 18:00: 0 18 * * 5
  // Seconds(optional) Minutes Hours DayOfMonth Month DayOfWeek
  cron.schedule('0 18 * * 5', () => {
    console.log('Scheduled task triggered: Friday 18:00');
    runAgentAndNotify();
  }, {
    timezone: 'America/Sao_Paulo' // Setting user's timezone if possible, or defaulting.
  });

  console.log('Scheduler started: Agent will run every Friday at 18:00.');
}
