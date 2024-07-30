import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wba-wallet.json"
import { hasGetLogsMethod } from "../tools/hasGetLogsMethod";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet.secret_key));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("3YTkbRsuufDntQPhYMgmPVNbq4dVGiibZiAshDgXhX4E");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,          // Devnet hardcoded
            keypair,             // Payer
            mint,                // mint
            keypair.publicKey    // owner
        );                       // curve false by default
        
        console.log(`Your ata is: ${ ata.address.toBase58() }`);

        // Mint tokens to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair.publicKey,
            1001n * token_decimals, 
        )

        console.log(`Your mint txid: ${mintTx}`);
    } catch (error) {
      console.log(`Oops, something went wrong: ${error}`);

      // Check if the error has a getLogs method
      if (hasGetLogsMethod(error)) {
        const logs = await error.getLogs();
        console.error("Transaction logs: ", logs);
    }
    }
})()

//  ATA:            Br6MQTcx1PMnFRkdNJWuDMyRff7znsBvWAAeLSb8CJY5
//  Transaction :   2SgGzT8E6e54PGhTNniWm8DExM2jtvprV9LrLPKAGrAzMuACvNQrr1xsqwxEAaUguQY6PBKzrKW1qKbnnRnp1qfN