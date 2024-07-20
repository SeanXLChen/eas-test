// https://github.com/ethereum-attestation-service/eas-sdk/blob/master/README.md#getting-an-attestation

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



// 
const uid = '0x736a318266327cd9210912260b28ac0c5e2517aee8ed1393c9c0f98004f58d3b';

const attestation = await eas.getAttestation(uid);

console.log(attestation);