import dotenv from "dotenv";

dotenv.config();

export const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
export const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";
export const PINATA_JWT = process.env.PINATA_JWT || "";

// Pinata API endpoints
export const PINATA_ENDPOINTS = {
  pinFileToIPFS: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  pinJSONToIPFS: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
};
