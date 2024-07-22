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
const schemaEncoder = new SchemaEncoder('uint256 ticketId, uint256 eventId, string seatNumber, address owner');

const encodedData = schemaEncoder.encodeData([
  { name: 'ticketId', value: 1000002, type: 'uint256' },
  { name: 'eventId', value: 123456789, type: 'uint256' },
  { name: 'seatNumber', value: 'A8-999', type: 'string' },
  { name: 'owner', value: '0x97B7a36A4f593f9c5398128B8C95b5C73730b58C', type: 'address' }
]);

const schemaUID = '0xb0b0bb9432b6b8ea22f4ae12baac4881d80e93a35abc6b032e19b4297916a418';

const transaction = await eas.attest({
  schema: schemaUID,
  data: {
    recipient: '0x97B7a36A4f593f9c5398128B8C95b5C73730b58C',
    expirationTime: 0,
    revocable: false, // Be aware that if your schema is not revocable, this MUST be false
    refUID: '0x4a0d55faa88803c6df5063372542ba4e0d9e03d20c80746f797d7a018aa8a6d9',
    data: encodedData
  }
});

const newAttestationUID = await transaction.wait();

console.log('New attestation UID:', newAttestationUID);

console.log('Transaction hash:', transaction.receipt.hash);