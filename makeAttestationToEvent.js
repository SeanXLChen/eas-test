import { EAS, Offchain, SchemaEncoder, SchemaRegistry, ZERO_ADDRESS } from "@ethereum-attestation-service/eas-sdk";
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
const schemaEncoder = new SchemaEncoder('uint256 eventId, string eventName, string eventDate, string eventLocation, string registrationDeadline, uint256 ticketQuantity, string imageURI');

const encodedData = schemaEncoder.encodeData([
  { name: 'eventId', value: 1, type: 'uint256' },
  { name: 'eventName', value: 'EAS Test Event 01', type: 'string' },
  { name: 'eventDate', value: '2025-01-01', type: 'string' },
  { name: 'eventLocation', value: 'Vancouver', type: 'string' },
  { name: 'registrationDeadline', value: '2024-08-01', type: 'string' },
  { name: 'ticketQuantity', value: 200, type: 'uint256' },
  { name: 'imageURI', value: 'ipfs://QmS4wrgKGHKtJAt3rgjuH3vKvC5CFLHoQHXxFc179fFyZN', type: 'string' }
]);

const schemaUID = '0xe065129fb26ee61dc9004af8cad19606ac8b39bf96580538142137554daa7220';

const transaction = await eas.attest({
  schema: schemaUID,
  data: {
    recipient: ZERO_ADDRESS,
    expirationTime: 0,
    revocable: false, // Be aware that if your schema is not revocable, this MUST be false
    data: encodedData
  }
});

const newAttestationUID = await transaction.wait();

console.log('New attestation UID:', newAttestationUID);

console.log('Transaction hash:', transaction.receipt.hash);