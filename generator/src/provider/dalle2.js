import OpenAI, { toFile } from 'openai';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { config } from '../config.js';
import { IPFSService } from '../ipfs.js';

export class DALLE2Provider {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    });
    this.ipfs = new IPFSService();
    this.requestCount = 0;
    this.lastReset = Date.now();
    this.maxRequestsPerMinute = 50; // DALL-E 2 has higher rate limits
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

  async _downloadImage(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  /**
   * Cleanup temporary file
   * @param {string} filePath
   */
  async _cleanupTempFile(filePath) {
    try {
      if (filePath) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.warn('Failed to clean up temp file:', error);
    }
  }

  /**
   * Converts image to PNG format and resizes to 256x256 for DALL-E 2 variation API
   * Uses filesystem to work around OpenAI API limitations with in-memory data
   * @param {import('pinata').GetCIDResponse} image
   * @returns {Promise<File>}
   */
  async _convertImageToPNG(image) {
    const tempFilePath = path.join(os.tmpdir(), `dalle_temp_${Date.now()}.png`);
    try {
      let imageBuffer;
      if (image.data instanceof Blob) {
        imageBuffer = await image.data.arrayBuffer();
      } else {
        imageBuffer = Buffer.from(image.data);
      }
      // Write directly to filesystem from Sharp to avoid intermediate buffer
      await sharp(imageBuffer)
        .resize(256, 256, {
          fit: 'cover',
          position: 'center',
        })
        .png()
        .toFile(tempFilePath);
      // Use toFile helper to create proper file object
      return await toFile(fs.createReadStream(tempFilePath), 'image.png', {
        type: 'image/png',
      });
    } catch (error) {
      // Clean up temp file if it was created
      try {
        await fs.promises.unlink(tempFilePath);
      } catch (cleanupError) {
        console.warn('Failed to clean up temp file:', cleanupError);
      }
      console.error('Error converting image to PNG:', error);
      throw error;
    }
  }

  async _generateTextOnlyImage(prompt, maxRetries = 3) {
    const enhancedPrompt = `${prompt}. High quality digital art, detailed, vibrant colors, professional artwork suitable for NFT collection.`;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.checkRateLimit();
        this.requestCount++;
        console.log(
          `Generating text-only image with DALL-E 2 (attempt ${attempt}/${maxRetries})`
        );
        const response = await this.openai.images.generate({
          model: 'dall-e-2',
          prompt: enhancedPrompt,
          n: 1,
          size: '1024x1024',
          response_format: 'url',
        });
        const imageUrl = response.data[0].url;
        console.log(`✅ Generated text-only image: ${imageUrl}`);
        const imageBuffer = await this._downloadImage(imageUrl);
        return {
          buffer: Buffer.from(imageBuffer),
          revisedPrompt: enhancedPrompt, // DALL-E 2 doesn't provide revised prompts
          hasReferenceImage: false,
          referenceImageUrl: null,
          styleAnalysis: null,
        };
      } catch (error) {
        console.error(`Text generation attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          throw error;
        }
        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(`Retrying text generation in ${backoffTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  async _generateVariationFromReference(
    referenceImageUrl,
    prompt,
    maxRetries = 3
  ) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      let imageFile;
      try {
        // Download and prepare the reference image
        console.log(
          `Downloading reference image for variation (attempt ${attempt}/${maxRetries})`
        );
        const referenceImage = await this.ipfs.downloadPrivateFile(
          referenceImageUrl
        );
        imageFile = await this._convertImageToPNG(referenceImage);

        await this.checkRateLimit();
        this.requestCount++;

        // Use DALL-E 2 createVariation API
        console.log(
          `🎨 Generating variation from reference image: ${referenceImageUrl}`
        );
        const response = await this.openai.images.createVariation({
          model: 'dall-e-2',
          image: imageFile,
          n: 1,
          size: '1024x1024',
          response_format: 'url',
        });

        const imageUrl = response.data[0].url;
        console.log(`✅ Generated variation from reference: ${imageUrl}`);
        const imageBuffer = await this._downloadImage(imageUrl);

        return {
          buffer: Buffer.from(imageBuffer),
          revisedPrompt: `Variation of reference image inspired by: ${prompt}`,
          hasReferenceImage: true,
          referenceImageUrl: referenceImageUrl,
          styleAnalysis:
            'Generated using DALL-E 2 image variation API from reference image',
        };
      } catch (error) {
        console.error(`Variation generation attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          // If variation fails, fallback to text-only generation with style description
          console.warn(
            'Variation generation failed, falling back to text-only generation with style description'
          );
          const stylePrompt = `${prompt}. Create artwork inspired by and matching the style of the reference image. High quality digital art, detailed, vibrant colors, professional artwork suitable for NFT collection.`;

          try {
            const response = await this.openai.images.generate({
              model: 'dall-e-2',
              prompt: stylePrompt,
              n: 1,
              size: '1024x1024',
              response_format: 'url',
            });

            const imageUrl = response.data[0].url;
            const imageBuffer = await this._downloadImage(imageUrl);

            return {
              buffer: Buffer.from(imageBuffer),
              revisedPrompt: stylePrompt,
              hasReferenceImage: true,
              referenceImageUrl: referenceImageUrl,
              styleAnalysis:
                'Generated with text prompt inspired by reference image (variation API failed)',
            };
          } catch (fallbackError) {
            console.error('Fallback generation also failed:', fallbackError);
            throw error; // Throw original variation error
          }
        }

        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(`Retrying variation generation in ${backoffTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  async generateWithRetry(prompt, referenceImageUrl = null, maxRetries = 3) {
    const hasReferenceImage = referenceImageUrl && referenceImageUrl !== '';

    if (hasReferenceImage) {
      console.log(
        `🎨 DALL-E 2: Generating variation from reference image: ${referenceImageUrl}`
      );
      return await this._generateVariationFromReference(
        referenceImageUrl,
        prompt,
        maxRetries
      );
    } else {
      console.log(`📝 DALL-E 2: Generating with text-only prompt: ${prompt}`);
      return await this._generateTextOnlyImage(prompt, maxRetries);
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
      model: 'DALL-E 2',
    };
  }
}
