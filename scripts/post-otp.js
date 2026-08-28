import { config } from '../src/config.js';

const otp = process.argv[2];
const purpose = process.argv[3] || 'hmil';

if (!otp) {
  console.error('Usage: node scripts/post-otp.js <otp_digits> [purpose_hmil_or_kia]');
  process.exit(1);
}

const token = config.otpWebhookToken || 'change-me';
const port = config.otpWebhookPort || 3333;
const url = `http://127.0.0.1:${port}/otp`;

console.log(`Posting OTP "${otp}" for purpose "${purpose}" to webhook ${url}...`);

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ otp, purpose })
  });

  if (response.ok) {
    const resData = await response.json();
    console.log('OTP successfully posted!', resData);
  } else {
    const errText = await response.text();
    console.error(`Failed to post OTP: ${response.status} ${response.statusText}`, errText);
  }
} catch (err) {
  console.error('Error posting OTP:', err.message);
}
