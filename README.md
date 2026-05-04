# 🤖 WhatsApp AI Bot

A student-level prototype of a WhatsApp AI chatbot that:
- Runs entirely on **GitHub Actions** (no server or hosting needed)
- Connects to WhatsApp using a **QR code scan** (WhatsApp Web approach)
- Replies to messages using **OpenRouter AI** (GPT-4o-mini free model)

> ⚠️ **Educational / Experimental use only.** Not for production. See limitations below.

---

## 📁 Project Structure

```
whatsapp-ai-bot/
├── index.js                    # Main bot logic (WhatsApp client)
├── ai.js                       # AI integration (OpenRouter API)
├── config.js                   # ← Configuration — edit this!
├── package.json                # Node.js dependencies
├── session/                    # Auto-created: stores WhatsApp session
└── .github/
    └── workflows/
        └── main.yml            # GitHub Actions workflow
```

---

## 🚀 Setup Guide (Step by Step)

### Step 1 — Get an OpenRouter API Key

1. Go to [https://openrouter.ai](https://openrouter.ai) and create a free account.
2. Navigate to **Keys** → **Create Key**.
3. Copy the key (it starts with `sk-or-...`).

---

### Step 2 — Configure `config.js`

Open `config.js` and fill in your credentials:

```js
OPENROUTER_API_KEY: "sk-or-YOUR-KEY-HERE",  // ← Paste your key
BASE_URL: "https://openrouter.ai/api/v1",    // ← Leave as-is
```

> 💡 The `BASE_URL` is already pre-filled with the correct OpenRouter endpoint.

---

### Step 3 — Push the Project to GitHub

1. Create a new GitHub repository (can be private).
2. Push all project files to it:

```bash
git init
git add .
git commit -m "Initial WhatsApp AI Bot"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### Step 4 — Run the GitHub Actions Workflow

1. Go to your GitHub repository in the browser.
2. Click the **Actions** tab at the top.
3. In the left sidebar, click **WhatsApp AI Bot**.
4. Click the **Run workflow** button (top right of the workflow list).
5. Confirm by clicking **Run workflow** in the dropdown.

---

### Step 5 — Scan the QR Code

1. After the workflow starts, click on the running job to open the log viewer.
2. Watch the logs — within a few seconds, a **QR code** will appear as ASCII art.
3. On your phone, open **WhatsApp**:
   - Tap **⋮ Menu** (Android) or **Settings** (iPhone)
   - Tap **Linked Devices**
   - Tap **Link a Device**
   - Scan the QR code shown in the GitHub Actions log
4. Once scanned, the bot will print:
   ```
   ✅ Authenticated successfully!
   🤖 WhatsApp AI Bot is READY and listening for messages!
   ```

---

### Step 6 — Test the Bot

Send a WhatsApp message to the phone number you scanned with.  
The bot will automatically reply using AI! 🎉

---

## ⚙️ How It Works (Internally)

```
You (WhatsApp) → Message → whatsapp-web.js client
                                    ↓
                           index.js receives message
                                    ↓
                           ai.js sends to OpenRouter
                                    ↓
                         OpenRouter calls GPT model
                                    ↓
                           AI reply returned to ai.js
                                    ↓
                        index.js sends reply via WhatsApp
                                    ↓
                         You receive the AI reply ✅
```

**Key components:**

| File | Role |
|------|------|
| `index.js` | Manages WhatsApp connection, listens for messages |
| `ai.js` | Sends messages to OpenRouter API, returns AI replies |
| `config.js` | Stores all configuration (API key, model, etc.) |
| `main.yml` | GitHub Actions workflow that runs the bot |

---

## 🔄 Re-running the Bot

Because GitHub Actions runs are **temporary**, the bot stops when the workflow ends (or after ~6 hours).

To restart:
1. Go to **Actions** tab on GitHub
2. Select **WhatsApp AI Bot**
3. Click **Run workflow** again

> 💡 If the `session/` folder was preserved from a previous run, you may **not** need to scan the QR again. However, GitHub Actions does not persist files between runs by default. Each run starts fresh.

---

## ⚠️ Limitations & Warnings

| Limitation | Details |
|------------|---------|
| ⏱️ 6-hour max runtime | GitHub Actions free tier limits workflow runs to ~6 hours |
| 🔄 Not persistent | Bot stops when the workflow ends; must re-run manually |
| 📱 QR required each run | Session is not preserved between workflow runs |
| 🚫 Not for production | WhatsApp may ban accounts using unofficial automation |
| 🆓 Free tier limits | OpenRouter free models have rate limits |
| 👥 Groups disabled | Bot ignores group messages by default (can be changed in `index.js`) |

---

## 🛠️ Customization

**Change the AI model** — edit `config.js`:
```js
MODEL: "openai/gpt-4o-mini:free",  // Change to any OpenRouter model
```

**Change the bot personality** — edit `config.js`:
```js
SYSTEM_PROMPT: "You are a sarcastic robot who loves dad jokes.",
```

**Enable group replies** — edit `index.js`, remove or comment out:
```js
if (message.isGroupMsg) return;
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `whatsapp-web.js` | WhatsApp Web automation (QR auth, send/receive messages) |
| `qrcode-terminal` | Renders QR code as ASCII art in the terminal/logs |

---

## 📄 License

MIT — Free to use, modify, and share for educational purposes.

