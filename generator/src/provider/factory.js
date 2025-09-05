// AI Image Generator Factory
// Allows easy switching between DALL-E 2 and DALL-E 3 implementations

import { DALLE3Provider } from './dalle3.js';
import { DALLE2Provider } from './dalle2.js';

export const Provider = Object.freeze({
  DALLE2: 'dalle2',
  DALLE3: 'dalle3',
});

/**
 * Creates an AI image generator based on configuration
 * @param {string} model - 'dalle2' or 'dalle3'
 * @returns {AIImageGenerator} AI generator instance
 */
export function createAIProvider(model = Provider.DALLE3) {
  switch (model) {
    case Provider.DALLE2:
      console.log(
        '🤖 Using DALL-E 2 with Image Variation API for reference images'
      );
      return new DALLE2Provider();

    case Provider.DALLE3:
    default:
      console.log('🤖 Using DALL-E 3 with Vision API for reference images');
      return new DALLE3Provider();
  }
}

/**
 * Get available AI models
 * @returns {Array} Available model names
 */
export function getAvailableModels() {
  return Object.values(Provider);
}
