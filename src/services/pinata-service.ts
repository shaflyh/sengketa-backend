import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { PINATA_JWT, PINATA_ENDPOINTS } from "../config/pinata-config";

export class PinataService {
  static async uploadFile(file: Express.Multer.File | undefined): Promise<string> {
    if (!file) return "";

    try {
      // Upload file first
      const formData = new FormData();
      formData.append("file", fs.createReadStream(file.path));

      const pinataMetadata = JSON.stringify({
        name: file.originalname,
        keyvalues: {
          type: "sengketa-putusan",
          timestamp: new Date().toISOString(),
        },
      });
      formData.append("pinataMetadata", pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 1,
      });
      formData.append("pinataOptions", pinataOptions);

      const fileResponse = await axios.post(PINATA_ENDPOINTS.pinFileToIPFS, formData, {
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          ...formData.getHeaders(),
        },
      });

      if (!fileResponse.data.IpfsHash) {
        throw new Error("Failed to get IPFS hash from Pinata");
      }

      // Create metadata object
      const metadata = {
        name: file.originalname,
        description: "Sengketa Document Metadata",
        attributes: {
          mimetype: file.mimetype,
          size: file.size,
          fileHash: fileResponse.data.IpfsHash,
          uploadedAt: new Date().toISOString(),
          type: "sengketa-putusan",
        },
      };

      // Upload metadata
      const metadataResponse = await axios.post(PINATA_ENDPOINTS.pinJSONToIPFS, metadata, {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      });

      // Clean up temporary file
      fs.unlinkSync(file.path);

      if (!metadataResponse.data.IpfsHash) {
        throw new Error("Failed to get metadata IPFS hash from Pinata");
      }

      return metadataResponse.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      // Clean up temporary file in case of error
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error; // Re-throw the error with more details
    }
  }

  static async getMetadata(cid: string): Promise<any> {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`, {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving metadata from Pinata:", error);
      throw error;
    }
  }

  static async getFileContent(cid: string): Promise<Buffer> {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`, {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        responseType: "arraybuffer",
      });
      return Buffer.from(response.data);
    } catch (error) {
      console.error("Error retrieving file content from Pinata:", error);
      throw error;
    }
  }
}
