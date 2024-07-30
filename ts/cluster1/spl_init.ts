import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../wba-wallet.json"
import { hasGetLogsMethod } from "../tools/hasGetLogsMethod";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet.secret_key));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Generate a new keypair for the mint account to avoid conflicts
        const mintKeypair = Keypair.generate();

        const mint = await createMint(
            connection,
            keypair,
            keypair.publicKey,
            keypair.publicKey,
            6,
            mintKeypair,
            {
                commitment: 'confirmed'
            }
        )

        console.log("Mint Address: %s", mint.toBase58());
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)

        // Check if the error has a getLogs method
        if (hasGetLogsMethod(error)) {
            const logs = await error.getLogs();
            console.error("Transaction logs: ", logs);
        }
    }
})()

// Mint Pubkey created: 3YTkbRsuufDntQPhYMgmPVNbq4dVGiibZiAshDgXhX4E