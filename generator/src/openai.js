import OpenAI from 'openai';
import { config } from './config.js';

export class AIImageGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    });
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
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.lastReset = Date.now();
    }
  }

  async generateImage(prompt, referenceImageUrl = null) {
    await this.checkRateLimit();
    
    try {
      this.requestCount++;
      
      let enhancedPrompt = prompt;
      if (referenceImageUrl) {
        enhancedPrompt += `. Style and composition inspired by reference image at ${referenceImageUrl}`;
      }
      
      enhancedPrompt += '. High quality digital art, detailed, vibrant colors, professional artwork suitable for NFT collection.';
      
      console.log(`Generating image with prompt: ${enhancedPrompt}`);
      
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "vivid"
      });

      const imageUrl = response.data[0].url;
      console.log(`Generated image URL: ${imageUrl}`);
      
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      
      return {
        buffer: Buffer.from(imageBuffer),
        revisedPrompt: response.data[0].revised_prompt || enhancedPrompt
      };
    } catch (error) {
      console.error('Error generating image with OpenAI:', error);
      throw error;
    }
  }

  async generateWithRetry(prompt, referenceImageUrl = null, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.generateImage(prompt, referenceImageUrl);
      } catch (error) {
        console.error(`Generation attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }

  getUsageStats() {
    return {
      requestCount: this.requestCount,
      lastReset: this.lastReset,
      remainingRequests: Math.max(0, this.maxRequestsPerMinute - this.requestCount)
    };
  }
}