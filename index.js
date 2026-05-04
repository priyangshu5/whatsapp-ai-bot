// ============================================================
// index.js — Main WhatsApp AI Bot entry point
// ============================================================
// This file:
//   1. Starts the WhatsApp Web client
//   2. Shows a QR code in the terminal for you to scan
//   3. Listens for incoming messages
//   4. Passes each message to the AI module
//   5. Sends the AI reply back to the user
// ============================================================

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const config = require("./config");
const { getAIResponse } = require("./ai");

// ============================================================
// Validate configuration before starting
// ============================================================
if (!config.OPENROUTER_API_KEY || config.OPENROUTER_API_KEY.trim() === "") {
  console.error(
    "❌ ERROR: OPENROUTER_API_KEY is not set in config.js.\n" +
      "   Open config.js and paste your OpenRouter API key."
  );
  process.exit(1); // Stop the process — bot cannot work without a key
}

if (!config.BASE_URL || config.BASE_URL.trim() === "") {
  console.error(
    "❌ ERROR: BASE_URL is not set in config.js.\n" +
      "   Open config.js and set the BASE_URL (e.g. https://openrouter.ai/api/v1)."
  );
  process.exit(1);
}

// ============================================================
// Initialize the WhatsApp client
// ============================================================
// LocalAuth saves your session to disk so you don't need to
// scan the QR code every single time (session is reused).
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: config.SESSION_DIR, // Where to save session files
  }),
  puppeteer: {
    // Run Chrome in headless mode (no visible browser window)
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",   // Needed for GitHub Actions / Docker
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  },
});

// ============================================================
// EVENT: QR code generated
// ============================================================
// When WhatsApp requires authentication, it generates a QR code.
// We display it in the terminal so the user can scan it with
// their phone (WhatsApp → Linked Devices → Link a Device).
client.on("qr", (qr) => {
  console.log("\n============================================================");
  console.log("📱 SCAN THIS QR CODE WITH YOUR WHATSAPP APP:");
  console.log("   WhatsApp → ⋮ Menu → Linked Devices → Link a Device");
  console.log("============================================================\n");
  // Render the QR code as ASCII art in the terminal
  qrcode.generate(qr, { small: true });
  console.log("\n⏳ Waiting for you to scan...\n");
});

// ============================================================
// EVENT: Client is authenticated (session restored or QR scanned)
// ============================================================
client.on("authenticated", () => {
  console.log("✅ Authenticated successfully! Session saved.");
});

// ============================================================
// EVENT: Authentication failed
// ============================================================
client.on("auth_failure", (msg) => {
  console.error("❌ Authentication failed:", msg);
  console.error("   Delete the ./session folder and try again.");
});

// ============================================================
// EVENT: Client is ready and connected to WhatsApp
// ============================================================
client.on("ready", () => {
  console.log("\n============================================================");
  console.log("🤖 WhatsApp AI Bot is READY and listening for messages!");
  console.log("   Send a WhatsApp message to this number to test.");
  console.log("============================================================\n");
});

// ============================================================
// EVENT: Incoming message received
// ============================================================
client.on("message", async (message) => {
  // ── Ignore messages sent by this bot itself (avoid loops)
  if (message.fromMe) return;

  // ── Ignore group messages (only reply to direct/private messages)
  // Remove or modify this line if you want the bot to reply in groups too
  if (message.isGroupMsg) {
    console.log("[Bot] Ignoring group message.");
    return;
  }

  const senderNumber = message.from; // e.g. "1234567890@c.us"
  const userText = message.body?.trim();

  // ── Ignore empty messages or non-text messages (stickers, images, etc.)
  if (!userText) {
    console.log("[Bot] Received non-text or empty message. Ignoring.");
    return;
  }

  console.log(`\n[Bot] 📨 Message from ${senderNumber}: "${userText}"`);

  try {
    // ── Send a "typing..." indicator while the AI is working
    const chat = await message.getChat();
    await chat.sendStateTyping();

    // ── Get the AI response for the user's message
    const aiReply = await getAIResponse(userText);

    console.log(`[Bot] 🤖 AI Reply: "${aiReply}"`);

    // ── Send the AI reply back to the user
    await message.reply(aiReply);

    console.log(`[Bot] ✅ Reply sent to ${senderNumber}`);
  } catch (error) {
    console.error("[Bot] ❌ Error handling message:", error.message);
    // Try to send an error message to the user so they know something went wrong
    try {
      await message.reply(
        "Sorry, I ran into a problem processing your message. Please try again!"
      );
    } catch (replyError) {
      console.error("[Bot] Could not send error reply:", replyError.message);
    }
  }
});

// ============================================================
// EVENT: Disconnected from WhatsApp
// ============================================================
client.on("disconnected", (reason) => {
  console.warn("\n⚠️  Bot disconnected from WhatsApp. Reason:", reason);
  console.warn("   The GitHub Actions workflow may have ended or timed out.");
  console.warn("   Re-run the workflow to reconnect.\n");
});

// ============================================================
// Start the WhatsApp client
// ============================================================
console.log("🚀 Starting WhatsApp AI Bot...");
console.log("   Using model:", config.MODEL);
console.log("   Session directory:", config.SESSION_DIR);
console.log("");

client.initialize();
