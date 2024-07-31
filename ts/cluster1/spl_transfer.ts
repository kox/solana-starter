import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { hasGetLogsMethod } from "../tools/hasGetLogsMethod";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet.secret_key));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("3YTkbRsuufDntQPhYMgmPVNbq4dVGiibZiAshDgXhX4E");

// Recipient address
const to = new PublicKey("fsPQvgoXVkc9dvY68pCvTjvBW7jHeFzHYN6nn7EhESp");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromATA = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey,
            false,
            'confirmed'
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toATA = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to,
            false,
            'confirmed'
        );

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection, 
            keypair, 
            fromATA.address, 
            toATA.address, 
            keypair, 
            1_000_000, 
            [keypair]
        );
        
        console.log(`The transaction was successfull: ${tx}`)
    } catch(error) {
        console.error(`Oops, something went wrong: ${error}`)

        // Check if the error has a getLogs method
        if (hasGetLogsMethod(error)) {
            const logs = await error.getLogs();
            console.error("Transaction logs: ", logs);
        }
    }
})();

// Successful transfer: 34DUWfoKpDSkHBVKDL7GnrcxWUxpauEchsGicqPkwxnNr25TPvhScYdHP5jq1udEYfU8gSUHWSgQSBhi6WSmePYA
// Fee Payer: Be9MdYwSsMUTLCA3pV9FaVsPDSJyuokjeNZLoaU13s1W
// Transaction Fee: 0.000005 SOL ($0.0000794)
// Transaction Size: 0 Bytes
// Compute Unit Consumed: 4,726 CU
// Instructions
// TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: Transfer 0.001 3YTkbRsuufDntQPhYMgmPVNbq4dVGiibZiAshDgXhX4E
// from: Be9MdYwSsMUTLCA3pV9FaVsPDSJyuokjeNZLoaU13s1W to: fsPQvgoXVkc9dvY68pCvTjvBW7jHeFzHYN6nn7EhESp