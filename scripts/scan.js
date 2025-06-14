const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const secretPatterns = [
  // Generic API Keys and Tokens
  /API[_-]?KEY\s*=\s*['"].+['"]/i,
  /TOKEN\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SECRET_KEY\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /PRIVATE_KEY\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /ACCESS[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /AUTH[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /BEARER[_-]?TOKEN\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /APP[_-]?SECRET\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /CLIENT[_-]?SECRET\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // Passwords and Credentials
  /PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /CREDENTIALS?\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /AUTH[_-]?PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /ADMIN[_-]?PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /ROOT[_-]?PASSWORD\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  
  // Database Credentials
  /DB[_-]?(?:PASSWORD|PASS|SECRET)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /DATABASE[_-]?(?:PASSWORD|PASS|SECRET)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /MONGO[_-]?(?:URI|PASSWORD|PASS)\s*=\s*['"][^'"]+['"]/i,
  /MYSQL[_-]?(?:PASSWORD|PASS)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /POSTGRES[_-]?(?:PASSWORD|PASS)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /SQLSERVER[_-]?(?:PASSWORD|PASS)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /REDIS[_-]?(?:PASSWORD|PASS)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /RABBITMQ[_-]?(?:PASSWORD|PASS)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /CASSANDRA[_-]?(?:PASSWORD|PASS)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /ELASTICSEARCH[_-]?(?:PASSWORD|PASS)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /NEO4J[_-]?(?:PASSWORD|PASS)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  
  // Cloud Provider Secrets
  /AWS[_-]?(?:ACCESS[_-]?KEY|SECRET[_-]?KEY|SESSION[_-]?TOKEN)\s*=\s*['"][A-Za-z0-9/+=]{20,}['"]/i,
  /AZURE[_-]?(?:SECRET|KEY|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /GCP[_-]?(?:SECRET|KEY|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /GOOGLE[_-]?(?:API[_-]?KEY|SECRET|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /DIGITAL[_-]?OCEAN[_-]?(?:TOKEN|KEY)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /HEROKU[_-]?(?:API[_-]?KEY|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /ALIBABA[_-]?(?:SECRET|KEY)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /ORACLE[_-]?(?:SECRET|KEY)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /IBM[_-]?(?:SECRET|KEY)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /VULTR[_-]?(?:API[_-]?KEY|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /LINODE[_-]?(?:API[_-]?KEY|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // Payment Processing
  /STRIPE[_-]?(?:SECRET[_-]?KEY|PUBLISHABLE[_-]?KEY)\s*=\s*['"](?:sk|pk)_(?:live|test)_[A-Za-z0-9]{24}['"]/i,
  /PAYPAL[_-]?(?:CLIENT[_-]?(?:SECRET|ID)|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SQUARE[_-]?(?:SECRET|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /BRAINTREE[_-]?(?:SECRET|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /ADYEN[_-]?(?:SECRET|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /KLARNA[_-]?(?:SECRET|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /WISE[_-]?(?:API[_-]?KEY|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // Social Media and Communication
  /TWITTER[_-]?(?:API[_-]?(?:KEY|SECRET)|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /FACEBOOK[_-]?(?:APP[_-]?SECRET|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /INSTAGRAM[_-]?(?:ACCESS[_-]?TOKEN|APP[_-]?SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /LINKEDIN[_-]?(?:CLIENT[_-]?SECRET|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /DISCORD[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{24,}['"]/i,
  /TELEGRAM[_-]?(?:BOT[_-]?TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{35,}['"]/i,
  /SLACK[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-]{24,}['"]/i,
  /TIKTOK[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /PINTEREST[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /TWITCH[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /REDDIT[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SNAPCHAT[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // Email Services
  /SENDGRID[_-]?(?:API[_-]?KEY|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /MAILCHIMP[_-]?(?:API[_-]?KEY|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SMTP[_-]?(?:PASSWORD|PASS)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /MAILGUN[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /POSTMARK[_-]?(?:API[_-]?KEY|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /AMAZON[_-]?SES[_-]?(?:KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SPARKPOST[_-]?(?:API[_-]?KEY|TOKEN)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // Infrastructure and DevOps
  /DOCKER[_-]?(?:PASSWORD|TOKEN)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /KUBERNETES[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /CLOUDFLARE[_-]?(?:API[_-]?TOKEN|KEY)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /GITHUB[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /GITLAB[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /BITBUCKET[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /JENKINS[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /TRAVIS[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /CIRCLECI[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /ANSIBLE[_-]?(?:VAULT[_-]?PASSWORD|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /TERRAFORM[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // Security and Authentication
  /JWT[_-]?(?:SECRET|KEY)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{32,}['"]/i,
  /OAUTH[_-]?(?:TOKEN|SECRET|KEY)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SSH[_-]?(?:KEY|PRIVATE[_-]?KEY)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SSL[_-]?(?:KEY|CERT)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /PGP[_-]?(?:KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /GPG[_-]?(?:KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /2FA[_-]?(?:SECRET|KEY)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /MFA[_-]?(?:SECRET|KEY)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // Specific Service Patterns
  /["'](?:AIza[0-9A-Za-z-_]{35})["']/g,  // Google API key
  /ghp_[A-Za-z0-9]{36}/,                 // GitHub Personal Token
  /gho_[A-Za-z0-9]{36}/,                 // GitHub OAuth Token
  /ghu_[A-Za-z0-9]{36}/,                 // GitHub User Token
  /ghs_[A-Za-z0-9]{36}/,                 // GitHub Server Token
  /ghr_[A-Za-z0-9]{36}/,                 // GitHub Refresh Token
  /eyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/,  // JWT tokens
  /[A-Za-z0-9-_]{32,}\.[A-Za-z0-9-_]{32,}\.[A-Za-z0-9-_]{32,}/,   // Generic JWT-like tokens
  
  // Generic Secret Patterns
  /SECRET\s*=\s*['"][A-Za-z0-9-_]{16,}['"]/i,
  /KEY\s*=\s*['"][A-Za-z0-9-_]{16,}['"]/i,
  /PASS(?:WORD)?\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  /TOKEN\s*=\s*['"][A-Za-z0-9-_]{16,}['"]/i,
  
  // Connection Strings
  /(?:MONGODB|MYSQL|POSTGRES|SQLSERVER|REDIS|RABBITMQ)[_-]?URI\s*=\s*['"][^'"]+['"]/i,
  /(?:DATABASE|DB)[_-]?URL\s*=\s*['"][^'"]+['"]/i,
  
  // API Endpoints with Credentials
  /https?:\/\/[^:]+:[^@]+@[^'"]+/i,
  
  // Private Keys
  /BEGIN[_-]?(?:RSA|EC|DSA|OPENSSH)[_-]?PRIVATE[_-]?KEY/i,
  /END[_-]?(?:RSA|EC|DSA|OPENSSH)[_-]?PRIVATE[_-]?KEY/i,
  
  // Additional Cloud Services
  /FIREBASE[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SUPABASE[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /VERCEL[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /NETLIFY[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // Analytics and Monitoring
  /MIXPANEL[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SEGMENT[_-]?(?:WRITE[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /AMPLITUDE[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /DATADOG[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /NEW[_-]?RELIC[_-]?(?:LICENSE[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // CDN and Storage
  /CLOUDFRONT[_-]?(?:KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /S3[_-]?(?:KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /RACKSPACE[_-]?(?:KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /BACKBLAZE[_-]?(?:KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // Search and Cache
  /ALGOLIA[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /ELASTIC[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /MEMCACHED[_-]?(?:PASSWORD|PASS)\s*=\s*['"][A-Za-z0-9-_!@#$%^&*()]{8,}['"]/i,
  
  // Maps and Location
  /MAPBOX[_-]?(?:TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /GOOGLE[_-]?MAPS[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /TOMTOM[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  
  // SMS and Voice
  /TWILIO[_-]?(?:AUTH[_-]?TOKEN|ACCOUNT[_-]?SID)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /NEXMO[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /PLIVO[_-]?(?:AUTH[_-]?TOKEN|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i,
  /SINCH[_-]?(?:API[_-]?KEY|SECRET)\s*=\s*['"][A-Za-z0-9-_]{32,}['"]/i
];

function scanFilesForSecrets(files = []) {
  let found = false;

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      let fileHasSecret = false;
      console.log(chalk.green('🔍 SecretShield scanning staged file... ', filePath));

      lines.forEach((line, idx) => {
        // Skip lines that have "safe to push" comment
        if (line.includes('// secretshield: safe to push') || line.includes('/* secretshield: safe to push */') || line.includes('/*secretshield: safe to push */') || line.includes('//secretshield: safe to push') ) {
          return;
        }

        for (const pattern of secretPatterns) {
          if (pattern.test(line)) {
            console.log(chalk.red(`🚨 Possible secret found in ${filePath} at line ${idx + 1}`));
            console.log(`🔎 Matched Line: ${line.trim()}`);
            fileHasSecret = true;
          }
        }
      });
      
    } catch (err) {
      console.warn(chalk.yellow(`⚠️ Skipped unreadable file: ${filePath}`));
    }
  }

  return found;
}


module.exports = scanFilesForSecrets;
