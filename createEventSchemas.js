import { EAS, Offchain, SchemaEncoder, SchemaRegistry, ZERO_ADDRESS, getSchemaUID } from "@ethereum-attestation-service/eas-sdk";
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


const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26

const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

schemaRegistry.connect(signer);


// const resolverAddress = '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0'; // Sepolia 0.26
const resolverAddress = ZERO_ADDRESS;
const revocable = true;

async function registerSchema(schema, resolverAddress, revocable) {
    try {
      const transaction = await schemaRegistry.register({
        schema,
        resolverAddress,
        revocable
      });
  
      // Optional: Wait for transaction to be validated
      const schemaUID = await transaction.wait();
      
      // another way to get UID
      // const schemaUID = getSchemaUID(schema, resolverAddress, revocable);

      console.log('Transaction hash:', transaction.receipt.hash);

      return schemaUID;
    } catch (error) {
      console.error('Error registering schema:', error);
    }
  }

  const eventSchema = "uint256 eventId, string eventName, string eventDate, string eventLocation, string registrationDeadline, uint256 ticketQuantity, string imageURI";
  
  const ticketSchema = "uint256 ticketId, uint256 eventId, string seatNumber, string imageURI";

  
  const eventUID = await registerSchema(eventSchema, resolverAddress, revocable);
  console.log(`Event schema registered successfully with UID: ${eventUID}`);

  const ticketUID = await registerSchema(ticketSchema, resolverAddress, revocable);
  console.log(`Ticket schema registered successfully with UID: ${ticketUID}`);