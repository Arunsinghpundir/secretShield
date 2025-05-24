const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const secretPatterns = [
  /API[_-]?KEY\s*=\s*['"].+['"]/i,
  /TOKEN\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SECRET_KEY\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /PRIVATE_KEY\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /DB[_-]?PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /JWT[_-]?SECRET\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{32,}['"]/i,
  /OAUTH[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /GITHUB[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-_]{40,}['"]/i,
  /AWS[_-]?ACCESS[_-]?KEY\s*=\s*['"][A-Z0-9]{20}['"]/i,
  /AWS[_-]?SECRET[_-]?KEY\s*=\s*['"][A-Za-z0-9/+=]{40}['"]/i,
  /GOOGLE[_-]?API[_-]?KEY\s*=\s*['"][A-Za-z0-9-_]{39}['"]/i,
  /STRIPE[_-]?SECRET[_-]?KEY\s*=\s*['"][sk_live_[A-Za-z0-9]{24}]['"]/i,
  /RABBITMQ[_-]?PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /REDIS[_-]?PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /MONGO[_-]?URI\s*=\s*['"][^'"]+mongodb:\/\/[^'"]+['"]/i,
  /MYSQL[_-]?PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /POSTGRES[_-]?PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /SQLSERVER[_-]?PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /AZURE[_-]?SECRET\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /DOCKER[_-]?PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /TWILIO[_-]?AUTH[_-]?TOKEN\s*=\s*['"][A-Za-z0-9]{32}['"]/i,
  /SLACK[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-]{24,}['"]/i,

  /PAYPAL[_-]?CLIENT[_-]?SECRET\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /PAYPAL[_-]?CLIENT[_-]?ID\s*=\s*['"][A-Za-z0-9-_]{16,}['"]/i,
  /SENDGRID[_-]?API[_-]?KEY\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /MAILCHIMP[_-]?API[_-]?KEY\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /TWITTER[_-]?API[_-]?KEY\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /TWITTER[_-]?API[_-]?SECRET\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /FACEBOOK[_-]?APP[_-]?SECRET\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /LINKEDIN[_-]?CLIENT[_-]?SECRET\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /INSTAGRAM[_-]?ACCESS[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i, 
  /INSTAGRAM[_-]?APP[_-]?SECRET\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /DISCORD[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-_]{24,}['"]/i,
  /TELEGRAM[_-]?BOT[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-_]{35,}['"]/i,
  /KUBERNETES[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /CLOUDFLARE[_-]?API[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SECRET\s*=\s*['"][A-Za-z0-9-_]{16,}['"]/i,
  /["'](?:AIza[0-9A-Za-z-_]{35})["']/g, // Google API key
  /ghp_[A-Za-z0-9]{36}/, // GitHub Personal Token
  /AWS_SECRET_ACCESS_KEY\s*=\s*['"][A-Za-z0-9/+=]{40}['"]/i
];

function scanFilesForSecrets(files = []) {
  let found = false;

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      for (let pattern of secretPatterns) {
        if (pattern.test(content)) {
          console.log(chalk.red(`🚨 Possible secret found in ${filePath}`));
          found = true;
          break;
        }
      }
    } catch (err) {
      console.warn(chalk.yellow(`⚠️ Skipped unreadable file: ${filePath}`));
    }
  }

  return found;
}

module.exports = scanFilesForSecrets;
