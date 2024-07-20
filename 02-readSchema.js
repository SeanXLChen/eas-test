import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { SEAN_PRIVATE_KEY, ALCHEMY_API_KEY } = process.env;

export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);

// Setting up the provider for the Sepolia testnet
const provider = new ethers.AlchemyProvider("sepolia", ALCHEMY_API_KEY);

// Connects an ethers style provider/signingProvider to perform read/write functions.
// MUST be a signer to do write operations!
const signer = new ethers.Wallet(SEAN_PRIVATE_KEY, provider);
eas.connect(signer);

console.log("EAS SDK initialized and connected to provider.");



// ### Query a schema info ###
const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
schemaRegistry.connect(provider);

const schemaUID = "0x9e30695f05ad280a1caf4ec15621dde07cd22aa8cf834e58b84b816c2ccfb6ac"; // search from the schema explorer https://sepolia.easscan.org/schemas

const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });

console.log(schemaRecord);