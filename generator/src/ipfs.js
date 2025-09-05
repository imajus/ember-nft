import { PinataSDK } from 'pinata';
import { config } from './config.js';

export class IPFSService {
  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: config.PINATA_JWT,
      pinataGateway: config.PINATA_GATEWAY_URL,
    });
  }

  convertIpfsToHttp(ipfsUrl) {
    return this.pinata.gateways.convert(ipfsUrl);
  }

  createAccessLink(ipfsUrl) {
    const cid = ipfsUrl.replace(/^ipfs:\/\//, '');
    return this.pinata.gateways.private.createAccessLink({
      cid,
      expires: 30, // 30 seconds
    });
  }

  async uploadImage(imageBuffer, filename) {
    try {
      const file = new File([imageBuffer], filename, { type: 'image/png' });
      const upload = await this.pinata.upload.public.file(file);
      console.log(`Image uploaded to IPFS: ${upload.cid}`);
      return upload.cid;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
    }
  }

  async uploadMetadata(metadata) {
    try {
      const upload = await this.pinata.upload.public.json(metadata);
      console.log(`Metadata uploaded to IPFS: ${upload.cid}`);
      return upload.cid;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw error;
    }
  }

  async uploadImageAndMetadata(imageBuffer, metadata, imageName) {
    try {
      const imageCid = await this.uploadImage(imageBuffer, imageName);
      const fullMetadata = {
        ...metadata,
        image: `ipfs://${imageCid}`,
      };
      const metadataCid = await this.uploadMetadata(fullMetadata);
      return { imageCid, metadataCid };
    } catch (error) {
      console.error('Error uploading image and metadata:', error);
      throw error;
    }
  }
}
