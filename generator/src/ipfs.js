import { PinataSDK } from 'pinata-web3';
import { config } from './config.js';

export class IPFSService {
  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: config.PINATA_JWT,
      pinataGateway: config.PINATA_GATEWAY_URL
    });
  }

  async uploadImage(imageBuffer, filename) {
    try {
      const file = new File([imageBuffer], filename, { type: 'image/png' });
      const upload = await this.pinata.upload.file(file);
      
      const imageUrl = `${config.PINATA_GATEWAY_URL}/ipfs/${upload.IpfsHash}`;
      console.log(`Image uploaded to IPFS: ${imageUrl}`);
      
      return {
        hash: upload.IpfsHash,
        url: imageUrl
      };
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
    }
  }

  async uploadMetadata(metadata) {
    try {
      const upload = await this.pinata.upload.json(metadata);
      
      const metadataUrl = `${config.PINATA_GATEWAY_URL}/ipfs/${upload.IpfsHash}`;
      console.log(`Metadata uploaded to IPFS: ${metadataUrl}`);
      
      return {
        hash: upload.IpfsHash,
        url: metadataUrl
      };
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw error;
    }
  }

  async uploadImageAndMetadata(imageBuffer, metadata, imageName) {
    try {
      const imageUpload = await this.uploadImage(imageBuffer, imageName);
      
      const fullMetadata = {
        ...metadata,
        image: imageUpload.url
      };
      
      const metadataUpload = await this.uploadMetadata(fullMetadata);
      
      return {
        image: imageUpload,
        metadata: metadataUpload
      };
    } catch (error) {
      console.error('Error uploading image and metadata:', error);
      throw error;
    }
  }
}