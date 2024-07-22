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
const schemaEncoder = new SchemaEncoder('uint256 eventId, string eventName, string eventDate, string eventLocation, string registrationDeadline, uint256 ticketQuantity');

const encodedData = schemaEncoder.encodeData([
  { name: 'eventId', value: 123456789, type: 'uint256' },
  { name: 'eventName', value: 'EAS Test Event', type: 'string' },
  { name: 'eventDate', value: '2022-01-01', type: 'string' },
  { name: 'eventLocation', value: 'EAS Test Location', type: 'string' },
  { name: 'registrationDeadline', value: '2021-12-31', type: 'string' },
  { name: 'ticketQuantity', value: 100, type: 'uint256' }
]);

const schemaUID = '0x039589f120eac2d0be07b3205e4f7fff0a4f996b1de2fe0255cf86953a0a994d';

const transaction = await eas.attest({
  schema: schemaUID,
  data: {
    recipient: '0xeF24C0343c04EebAf35b882131F3F1CD65523138',
    expirationTime: 0,
    revocable: false, // Be aware that if your schema is not revocable, this MUST be false
    data: encodedData
  }
});

const newAttestationUID = await transaction.wait();

console.log('New attestation UID:', newAttestationUID);

console.log('Transaction hash:', transaction.receipt.hash);