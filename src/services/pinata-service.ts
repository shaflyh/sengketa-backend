import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { PINATA_JWT, PINATA_ENDPOINTS } from "../config/pinata-config";

export class PinataService {
  static async uploadFile(file: Express.Multer.File | undefined): Promise<string> {
    if (!file) return "";

    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(file.path), {
        filename: file.originalname,
      });

      // Add Pinata options for file organization
      const options = JSON.stringify({
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name: file.originalname,
          keyvalues: {
            type: "sengketa-putusan",
            timestamp: new Date().toISOString(),
          },
        },
      });
      formData.append("pinataOptions", options);

      const response = await axios.post(PINATA_ENDPOINTS.pinFileToIPFS, formData, {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          ...formData.getHeaders(),
        },
      });

      if (!response.data.IpfsHash) {
        throw new Error("Failed to get IPFS hash from Pinata");
      }

      const metadata = {
        name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        fileHash: response.data.IpfsHash,
      };

      // Add metadata options for organization
      const metadataOptions = {
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name: `metadata-${file.originalname}`,
          keyvalues: {
            type: "sengketa-putusan-metadata",
            originalFileHash: response.data.IpfsHash,
            timestamp: new Date().toISOString(),
          },
        },
      };

      const metadataResponse = await axios.post(
        PINATA_ENDPOINTS.pinJSONToIPFS,
        { ...metadata, ...metadataOptions },
        {
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!metadataResponse.data.IpfsHash) {
        throw new Error("Failed to get metadata IPFS hash from Pinata");
      }

      fs.unlinkSync(file.path);
      return metadataResponse.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new Error("Failed to upload file to IPFS");
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
}
