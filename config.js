// ============================================================
// config.js — All configuration variables for the WhatsApp AI Bot
// ============================================================
// ⚠️  IMPORTANT: Fill in your credentials below before running.
// DO NOT share this file publicly after filling in your keys.
// ============================================================

const config = {
  // ----------------------------------------------------------
  // 🔑 OpenRouter API Key
  // Get yours at: https://openrouter.ai/keys
  // Paste it inside the quotes below ↓
  // ----------------------------------------------------------
  OPENROUTER_API_KEY: "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", // <-- PASTE YOUR OPENROUTER API KEY HERE

  // ----------------------------------------------------------
  // 🌐 OpenRouter Base URL (do not change unless instructed)
  // ----------------------------------------------------------
  BASE_URL: "https://openrouter.ai/api/v1", // <-- PASTE BASE URL HERE (default shown)

  // ----------------------------------------------------------
  // 🤖 AI Model to use via OpenRouter
  // ----------------------------------------------------------
  MODEL: "openai/gpt-oss-120b:free", // Free model; change if needed

  // ----------------------------------------------------------
  // 💬 System prompt — defines the bot's personality/behavior
  // ----------------------------------------------------------
  SYSTEM_PROMPT:
    "You are a helpful, friendly AI assistant responding to WhatsApp messages. Keep your answers concise and clear.",

  // ----------------------------------------------------------
  // ⏱️ Request timeout in milliseconds (15 seconds default)
  // ----------------------------------------------------------
  REQUEST_TIMEOUT_MS: 15000,

  // ----------------------------------------------------------
  // 📁 Directory to store WhatsApp session data
  // ----------------------------------------------------------
  SESSION_DIR: "./session",
};

module.exports = config;
