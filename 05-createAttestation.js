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
console.log('\n##### Signer Address:', signer.address, '#####\n');
eas.connect(signer);

console.log("EAS SDK initialized and connected to provider.");





// ### createAttestation ###

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder('uint256 eventId, uint8 voteIndex');
const encodedData = schemaEncoder.encodeData([
  { name: 'eventId', value: 123456789, type: 'uint256' },
  { name: 'voteIndex', value: 69, type: 'uint8' }
]);

const schemaUID = '0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995';

const transaction = await eas.attest({
  schema: schemaUID,
  data: {
    recipient: '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165',
    expirationTime: 0,
    revocable: true, // Be aware that if your schema is not revocable, this MUST be false
    data: encodedData
  }
});

const newAttestationUID = await transaction.wait();

console.log('New attestation UID:', newAttestationUID);

console.log('Transaction receipt:', transaction.receipt);