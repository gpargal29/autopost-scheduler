const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate structured quote metadata using OpenAI API
 * @param {string} category - Selected category
 * @param {string} customTopic - Optional custom topic or keywords
 * @param {string} tone - Tone of the quote (Inspirational, Professional, etc.)
 * @param {string} targetAudience - Target audience descriptor
 * @returns {Promise<Object>} Generated quote object
 */
const generateQuoteAI = async ({ category, customTopic = '', tone = 'Inspirational', targetAudience = 'General Professional' }) => {
  const systemPrompt = `You are a world-class content creator and social media strategist specializing in high-engagement quotes.
Your task is to generate a powerful, original, high-impact quote along with social media post metadata.

Format your output strictly as a raw JSON object with no markdown formatting wrappers (do NOT wrap in \`\`\`json \`\`\`).
The JSON object MUST contain the following keys:
- "quote": (string) The main impactful quote text.
- "author": (string) Original author or attribution (e.g. "Anonymous Visionary", "Mindset Master", or an established figure if applicable).
- "caption": (string) A compelling social media post caption (100-200 words) designed to spark conversation.
- "explanation": (string) A concise 2-3 sentence explanation of the deeper meaning behind the quote.
- "hashtags": (array of strings) 5 to 8 relevant trending hashtags including leading '#' symbols.
- "emojiSuggestions": (array of strings) 4 to 6 contextually relevant emojis.
- "imagePrompt": (string) A detailed visual image generation prompt suitable for Midjourney or DALL-E 3 matching the quote's theme.
- "suggestedPostingTime": (string) Specific recommended time and rationale (e.g., "08:30 AM (Peak morning commute focus)").
- "engagementSuggestions": (array of strings) 2 to 3 actionable tips to increase comments and shares (e.g., question prompts, calls-to-action).`;

  const userPrompt = `Generate content for:
Category: ${category}
${customTopic ? `Specific Focus/Topic: ${customTopic}` : ''}
Tone: ${tone}
Target Audience: ${targetAudience}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    let rawContent = response.choices[0].message.content.trim();

    // Clean up potential markdown formatting code blocks if returned by OpenAI
    if (rawContent.startsWith('```json')) {
      rawContent = rawContent.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (rawContent.startsWith('```')) {
      rawContent = rawContent.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(rawContent);

    return {
      quote: parsedData.quote || 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      author: parsedData.author || 'AI Visionary',
      caption: parsedData.caption || `Embrace the journey of ${category.toLowerCase()}. Growth happens when you push beyond comfort boundaries.`,
      explanation: parsedData.explanation || `This quote highlights the power of perseverance in the ${category.toLowerCase()} journey.`,
      hashtags: Array.isArray(parsedData.hashtags) ? parsedData.hashtags : [`#${category}`, '#GrowthMindset', '#Inspiration'],
      emojiSuggestions: Array.isArray(parsedData.emojiSuggestions) ? parsedData.emojiSuggestions : ['🚀', '💡', '✨', '🎯'],
      imagePrompt: parsedData.imagePrompt || `A cinematic, ultra-detailed conceptual image representing ${category.toLowerCase()} and achievement.`,
      suggestedPostingTime: parsedData.suggestedPostingTime || '09:00 AM (Peak morning focus time)',
      engagementSuggestions: Array.isArray(parsedData.engagementSuggestions)
        ? parsedData.engagementSuggestions
        : ['What does this quote mean to you? Share below!', 'Tag a friend who needs to read this today.'],
    };
  } catch (error) {
    console.error('OpenAI Quote Generation Error:', error);
    throw new Error(error.message || 'Failed to generate quote using OpenAI API');
  }
};

module.exports = {
  generateQuoteAI,
};
