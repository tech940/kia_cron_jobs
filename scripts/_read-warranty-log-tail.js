import fs from 'node:fs/promises';

const logFile = 'c:\\Users\\HP\\Downloads\\Kia_Cron_Job\\logs\\pm2-hmil-warranty-out.log';
const content = await fs.readFile(logFile, 'utf8');
const lines = content.split('\n');
console.log('--- Last 100 lines of pm2-hmil-warranty-out.log ---');
for (let i = Math.max(0, lines.length - 100); i < lines.length; i++) {
  console.log(lines[i].trim());
}
