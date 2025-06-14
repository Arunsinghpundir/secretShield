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
- 🧠 Detects over **30+ secret patterns**
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

SecretShield currently detects:

- ✅ API Keys (Google, Twitter, Facebook, etc.)
- ✅ Cloud Provider Keys (AWS, GCP, Azure)
- ✅ Database Credentials (Postgres, MongoDB, MySQL, SQL Server)
- ✅ Payment Gateways (Stripe, PayPal)
- ✅ JWT and OAuth Tokens
- ✅ Email Services (SendGrid, Mailchimp)
- ✅ Private Keys and Certificates
- ✅ Infrastructure Secrets (Docker, Kubernetes)
- ✅ And many more...

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
