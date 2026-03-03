import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const personalChatId = process.env.TELEGRAM_CHAT_ID;
const groupId = process.env.TELEGRAM_GROUP_ID;

if (!botToken) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env');
}

const bot = new Telegraf(botToken);

const MAX_MESSAGE_LENGTH = 4000;

function splitMessage(text: string): string[] {
  const chunks: string[] = [];
  let currentPos = 0;

  while (currentPos < text.length) {
    let targetEnd = currentPos + MAX_MESSAGE_LENGTH;
    if (targetEnd >= text.length) {
      chunks.push(text.substring(currentPos));
      break;
    }

    // Try to split at a section break (indicated by emojis or double newlines)
    let splitPoint = text.lastIndexOf('\n\n', targetEnd);
    
    // If no double newline, try single newline
    if (splitPoint <= currentPos) {
      splitPoint = text.lastIndexOf('\n', targetEnd);
    }

    // If still no newline (very unlikely in this report), just split at MAX
    if (splitPoint <= currentPos) {
      splitPoint = targetEnd;
    }

    chunks.push(text.substring(currentPos, splitPoint).trim());
    currentPos = splitPoint;
  }
  return chunks;
}

async function sendMessageWithFallback(chatId: string, content: string) {
  const chunks = splitMessage(content);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const prefix = chunks.length > 1 ? `[Parte ${i + 1}/${chunks.length}]\n\n` : '';
    const message = prefix + chunk;

    try {
      // Try sending with Markdown
      await bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (err: any) {
      console.error(`Markdown send failed for chat ${chatId} (chunk ${i+1}): ${err.message}. Retrying as plain text...`);
      try {
        // Retry without Markdown formatting
        await bot.telegram.sendMessage(chatId, message);
      } catch (retryErr: any) {
        console.error(`Plain text retry failed for chat ${chatId} (chunk ${i+1}): ${retryErr.message}`);
      }
    }
  }
}

export async function sendReport(content: string) {
  if (personalChatId) {
    await sendMessageWithFallback(personalChatId, content);
  }

  if (groupId) {
    await sendMessageWithFallback(groupId, content);
  }

  if (!personalChatId && !groupId) {
    console.warn('No chat IDs configured. Report won\'t be sent to Telegram.');
    console.log('--- REPORT CONTENT ---');
    console.log(content);
    console.log('----------------------');
    return;
  }

  console.log('Report sending process completed.');
}
