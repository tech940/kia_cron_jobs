import fs from 'node:fs/promises';
import path from 'node:path';

const logsDir = 'c:\\Users\\HP\\Downloads\\Kia_Cron_Job\\logs';
const files = await fs.readdir(logsDir);

for (const file of files) {
  const filePath = path.join(logsDir, file);
  const stat = await fs.stat(filePath);
  if (!stat.isFile()) continue;

  if (stat.size > 200 * 1024 * 1024) continue; // Skip files > 200MB

  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');
  console.log(`Scan: ${file}`);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('2026-08-03') && lines[i].includes('N5216')) {
      console.log(`L${i}: ${lines[i].trim()}`);
    }
  }
}
