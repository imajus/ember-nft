import OpenAI from 'openai';
import { config } from '../config.js';
import { IPFSService } from '../ipfs.js';

export class DALLE3Provider {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    });
    this.ipfs = new IPFSService();
    this.requestCount = 0;
    this.lastReset = Date.now();
    this.maxRequestsPerMinute = 20;
  }

  async checkRateLimit() {
    const now = Date.now();
    const timeElapsed = now - this.lastReset;
    if (timeElapsed > 60000) {
      this.requestCount = 0;
      this.lastReset = now;
    }
    if (this.requestCount >= this.maxRequestsPerMinute) {
      const waitTime = 60000 - timeElapsed;
      console.log(`Rate limit reached, waiting ${waitTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastReset = Date.now();
    }
  }

  async _analyzeReferenceImage(referenceImageUrl) {
    try {
      console.log(`🔍 Analyzing reference image: ${referenceImageUrl}`);
      const httpUrl = await this.ipfs.createAccessLink(referenceImageUrl);
      // Use OpenAI Vision API to analyze the reference image
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this reference image and describe its artistic style, color palette, composition, and key visual elements that would be important for generating similar artwork. Focus on style elements that can be replicated.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: httpUrl,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      });
      const analysis = response.choices[0].message.content;
      console.log(`📋 Reference image analysis: ${analysis}`);
      return analysis;
    } catch (error) {
      console.error('Error analyzing reference image:', error);
      // Return a fallback analysis
      return 'inspired by the provided reference image style and aesthetic';
    }
  }

  async _buildEnhancedPrompt(prompt, referenceImageUrl) {
    let enhancedPrompt = prompt;
    let styleAnalysis = null;
    if (referenceImageUrl && referenceImageUrl !== '') {
      console.log(`🎨 Processing reference image: ${referenceImageUrl}`);
      // Analyze the reference image to get better style description
      try {
        styleAnalysis = await this._analyzeReferenceImage(referenceImageUrl);
        enhancedPrompt = `${prompt}. Create this artwork ${styleAnalysis}. `;
        enhancedPrompt += `Maintain the visual coherence and artistic direction while making it unique.`;
      } catch (error) {
        console.warn(
          'Could not analyze reference image, proceeding with basic style prompt'
        );
        enhancedPrompt += `. Using the style, color palette, and artistic elements from the reference image provided. Maintain the overall aesthetic and visual theme while incorporating the requested elements.`;
      }
    }
    enhancedPrompt +=
      '. High quality digital art, detailed, vibrant colors, professional artwork suitable for NFT collection.';
    return { enhancedPrompt, styleAnalysis };
  }

  async generateWithRetry(prompt, referenceImageUrl = null, maxRetries = 3) {
    const hasReferenceImage = referenceImageUrl && referenceImageUrl !== '';

    if (hasReferenceImage) {
      console.log(`🎨 Generating with reference image: ${referenceImageUrl}`);
    } else {
      console.log(`📝 Generating with text-only prompt: ${prompt}`);
    }
    // Build enhanced prompt with reference image analysis (if applicable)
    const { enhancedPrompt, styleAnalysis } = await this._buildEnhancedPrompt(
      prompt,
      referenceImageUrl
    );
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.checkRateLimit();
        this.requestCount++;
        console.log(`Generating image (attempt ${attempt}/${maxRetries})`);
        const response = await this.openai.images.generate({
          model: 'dall-e-3',
          prompt: enhancedPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'hd',
          style: 'vivid',
        });
        const imageUrl = response.data[0].url;
        console.log(`✅ Generated image: ${imageUrl}`);
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        return {
          buffer: Buffer.from(imageBuffer),
          revisedPrompt: response.data[0].revised_prompt || enhancedPrompt,
          hasReferenceImage,
          referenceImageUrl: hasReferenceImage ? referenceImageUrl : null,
          styleAnalysis: hasReferenceImage ? styleAnalysis : null,
        };
      } catch (error) {
        console.error(`Generation attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          throw error;
        }
        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  getUsageStats() {
    return {
      requestCount: this.requestCount,
      lastReset: this.lastReset,
      remainingRequests: Math.max(
        0,
        this.maxRequestsPerMinute - this.requestCount
      ),
    };
  }
}
