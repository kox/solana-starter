import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey, signerPayer, base58 } from "@metaplex-foundation/umi";
import { string, publicKey as publicKeySerializer, } from "@metaplex-foundation/umi/serializers";
import { PublicKey } from "@solana/web3.js";
import { hasGetLogsMethod } from "../tools/hasGetLogsMethod";
import { web3 } from "@coral-xyz/anchor";
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";

// Define our Mint address
/* const mintKeypair = web3.Keypair.generate(); 
 */
const mint = publicKey("Cd1sP6ZjLp5yeyiCpe7avjv4U6r9e292cpcAsdonaLUM")

/* console.log(mintKeypair); */

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet.secret_key));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        
        // Create new token mint
        /* const mint = await createMint(
            connection,
            keypair,
            keypair.publicKey,
            null,
            14
        )

        const mint = web3.Keypair.generate(); */
        
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            // metadata?: PublicKey | Pda;
            mint, // : fromWeb3JsPublicKey(mintKeypair.publicKey),
            mintAuthority: signer,
            payer: signer,
            updateAuthority: signer,
        }; 

        let data: DataV2Args = {
            name: 'WBA Turbine Cohort 7th Edition',
            symbol: 'WBAT7',
            uri: 'https://ipfs.io/ipfs/QmTRvv8Z6dgbB9maQejo7v9ezVBePBvTYGyZPcFpu9wryE',
            sellerFeeBasisPoints: 5000,
            creators: null,
            collection: null,
            uses: null,
        };

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null,
        }

        let tx = createMetadataAccountV3(umi, {
            ...accounts,
            ...args,
        })

        let result = await tx.sendAndConfirm(umi)
        const signature = base58.deserialize(result.signature)

        console.log(
            `Succesfully Minted!. Transaction Here: https://solana.fm/tx/${signature[0]}?cluster=devnet`
        )
    } catch(error) {
        console.error(`Oops, something went wrong: ${error}`)

        // Check if the error has a getLogs method
        if (hasGetLogsMethod(error)) {
            const logs = await error.getLogs();
            console.error("Transaction logs: ", logs);
        }
    }
})();


// Succesfully Minted!. Transaction Here: https://solana.fm/tx/3LK2cwkR2TS9Hs7GuVans32bjQLy7so5hEBg5nEVqmrteoPjrWVH4f4PmeJmbextyEKmEvv5HpU7BXZ8ubKZaTBw?cluster=devnet