// ============================================================
// ai.js — AI integration module using OpenRouter API
// ============================================================
// This module sends a user's message to the AI and returns
// the AI's text response. It uses the fetch API (Node 18+).
// ============================================================

const config = require("./config");

/**
 * Sends a user message to the OpenRouter AI API and returns the reply.
 *
 * @param {string} userMessage - The message text received from WhatsApp
 * @returns {Promise<string>} - The AI-generated reply text
 */
async function getAIResponse(userMessage) {
  // Build the request URL
  const url = `${config.BASE_URL}/chat/completions`;

  // Construct the request body following OpenAI-compatible format
  const requestBody = {
    model: config.MODEL,
    messages: [
      {
        role: "system",
        content: config.SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    max_tokens: 500, // Limit response length for WhatsApp readability
    temperature: 0.7, // Slight creativity; 0 = deterministic, 1 = creative
  };

  // Set up an AbortController for request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    config.REQUEST_TIMEOUT_MS
  );

  try {
    console.log("[AI] Sending message to OpenRouter API...");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization header with your API key
        Authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
        // OpenRouter recommends this header for tracking
        "HTTP-Referer": "https://github.com/whatsapp-ai-bot",
        "X-Title": "WhatsApp AI Bot",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    // Clear the timeout since we got a response
    clearTimeout(timeoutId);

    // Check if the HTTP response status is OK (200–299)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[AI] API error ${response.status}: ${errorText}`);
      return "Sorry, I encountered an error talking to the AI. Please try again later.";
    }

    // Parse the JSON response body
    const data = await response.json();

    // Extract the reply text from the response structure
    const reply =
      data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error("[AI] Unexpected response structure:", JSON.stringify(data));
      return "Sorry, I received an unexpected response from the AI.";
    }

    console.log("[AI] Response received successfully.");
    return reply;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle timeout specifically
    if (error.name === "AbortError") {
      console.error("[AI] Request timed out.");
      return "Sorry, the AI took too long to respond. Please try again.";
    }

    // Handle any other errors (network issues, etc.)
    console.error("[AI] Unexpected error:", error.message);
    return "Sorry, something went wrong. Please try again later.";
  }
}

module.exports = { getAIResponse };
