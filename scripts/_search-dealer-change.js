import fs from 'node:fs/promises';

const logFile = 'c:\\Users\\HP\\Downloads\\Kia_Cron_Job\\logs\\pm2-hmil-warranty-out.log';
const content = await fs.readFile(logFile, 'utf8');
const lines = content.split('\n');

console.log('--- Lines 157200 to 157400 of pm2-hmil-warranty-out.log ---');
for (let i = 157200; i < Math.min(lines.length, 157400); i++) {
  console.log(`L${i}: ${lines[i].trim()}`);
}

