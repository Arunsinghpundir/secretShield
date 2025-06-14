# 🔒 SecretShield

**Secure your commits before they go public!**

`SecretShield` is a powerful, blazing-fast CLI tool to scan your codebase for hardcoded secrets like API keys, tokens, database passwords, and more. Avoid accidental leaks and secure your development workflow in seconds.

---

![npm](https://img.shields.io/npm/v/secretshield?color=blue)
![license](https://img.shields.io/github/license/Arunsinghpundir/secretshield)
![issues](https://img.shields.io/github/issues/Arunsinghpundir/secretshield)
![downloads](https://img.shields.io/npm/dt/secretshield)

---

## 🚀 Features

- 🔍 **Comprehensive scanning** of staged files for sensitive data
- 🧠 Detects over **127+ secret patterns**
- ⚡ **Fast and efficient** CLI execution
- 🎨 **Colorful logs** using Chalk
- 🔄 Easy integration with Git hooks and CI/CD
- 🔐 Prevents accidental commits of secrets

---

## 📦 Installation

You can install SecretShield globally or use it with `npx`.

### Option 1 – Run directly without install:

```bash
npx secret-shield
```

### Option 2 – Install globally:

```bash
npm install -g secret-shield
```

### Option 3 – Install locally (for projects):

```bash
npm install --save-dev secret-shield
```

---

## 🛠️ How to Use

Once installed, simply run:

```bash
npx secret-shield
```

Or, if installed globally:

```bash
secretshield
```

This will scan your **staged files** (those added via `git add`) for any potential secrets.

### Example Output

```bash
✅ SecretShield CLI is working!
🔍 SecretShield scanning staged files...
📂 Files to scan: [ './.env', './app.js' ]
🚨 Possible secret found in ./app.js at line 12
🔎 Matched Line: API_KEY="sk_live_1234567890abcdef"
❌ Commit blocked. Secrets detected!
```

---

## 🧠 Supported Secret Patterns

SecretShield currently detects over 127 patterns across multiple categories:

### 🔑 Authentication & Security

- ✅ API Keys (Google, Twitter, Facebook, etc.)
- ✅ JWT and OAuth Tokens
- ✅ 2FA/MFA Secrets
- ✅ PGP/GPG Keys
- ✅ SSH Private Keys
- ✅ SSL Certificates

### ☁️ Cloud Services

- ✅ AWS (Access Keys, Secret Keys, Session Tokens)
- ✅ Azure (Keys, Secrets, Tokens)
- ✅ Google Cloud Platform
- ✅ Firebase & Supabase
- ✅ Vercel & Netlify
- ✅ Digital Ocean, Heroku, Vultr, Linode
- ✅ Alibaba Cloud, Oracle Cloud, IBM Cloud

### 💾 Database & Storage

- ✅ MongoDB, MySQL, PostgreSQL
- ✅ Redis, RabbitMQ, Cassandra
- ✅ Elasticsearch, Neo4j
- ✅ S3, CloudFront, Rackspace
- ✅ Backblaze Storage

### 💳 Payment Processing

- ✅ Stripe (Secret & Publishable Keys)
- ✅ PayPal (Client ID & Secret)
- ✅ Square, Braintree, Adyen
- ✅ Klarna, Wise

### 📱 Social Media & Communication

- ✅ Twitter, Facebook, Instagram
- ✅ LinkedIn, Discord, Telegram
- ✅ Slack, TikTok, Pinterest
- ✅ Twitch, Reddit, Snapchat

### 📧 Email Services

- ✅ SendGrid, Mailchimp
- ✅ Mailgun, Postmark
- ✅ Amazon SES, SparkPost
- ✅ SMTP Credentials

### 🛠️ DevOps & Infrastructure

- ✅ Docker, Kubernetes
- ✅ GitHub, GitLab, Bitbucket
- ✅ Jenkins, Travis CI, CircleCI
- ✅ Ansible Vault, Terraform
- ✅ Cloudflare

### 📊 Analytics & Monitoring

- ✅ Mixpanel, Segment
- ✅ Amplitude, Datadog
- ✅ New Relic

### 🔍 Search & Cache

- ✅ Algolia, Elastic
- ✅ Memcached

### 🗺️ Maps & Location

- ✅ Google Maps
- ✅ Mapbox, TomTom

### 📞 SMS & Voice

- ✅ Twilio (Auth Token, Account SID)
- ✅ Nexmo (Vonage)
- ✅ Plivo, Sinch

### 🔄 Generic Patterns

- ✅ Connection Strings
- ✅ Credential URLs
- ✅ Generic Secrets & Keys
- ✅ Private Key Files

🔧 You can also **customize the regex** for your org in future versions!

---

## 🔄 Git Hook Setup (Optional)

Add this to your **pre-commit hook**:

```bash
#!/bin/sh
npx secret-shield
if [ $? -ne 0 ]; then
  echo "❌ SecretShield blocked your commit!"
  exit 1
fi
```

Or use tools like [husky](https://github.com/typicode/husky) to integrate it smoothly into your dev workflow.

---

## 🛡️ Security

If you discover a vulnerability or a false negative, **please do not report it publicly.**
Instead, reach out securely:
📧 **[support@decodedev.in](mailto:support@decodedev.in)**

---

## 🚫 Ignoring Specific Lines

If you need to ignore a specific line that contains a secret (for example, if it's a test value or a public key), you can add a special comment to that line. SecretShield will skip any line that contains this comment.

### Supported Comment Formats:

```javascript
const API_KEY = "test-key-123"; // secretshield: safe to push
const DB_PASSWORD = "test-pass-456"; /* secretshield: safe to push */
const SECRET_TOKEN = "test-token-789"; /*secretshield: safe to push */
const AUTH_KEY = "test-auth-012"; //secretshield: safe to push
```

> ⚠️ **Important**: Use this feature carefully and only for legitimate cases where the secret is safe to commit (like test values, public keys, or intentionally public tokens).

---

## 🧑‍💻 Author

**Arunq Singh Pundir**
[GitHub – @Arunsinghpundir](https://github.com/Arunsinghpundir)

---

## 📃 License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)

---

## 🌟 Support the Project

If you find SecretShield useful:

- ⭐ Star the repo on [GitHub](https://github.com/Arunsinghpundir/secretShield)
- 📢 Share it with your developer friends
- 💬 Suggest improvements or contribute!

---

> “The best time to protect secrets was yesterday. The second best time is now.” 🔐
