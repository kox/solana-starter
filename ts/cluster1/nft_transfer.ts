import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount, Signer, publicKeyBytes, Pda, PublicKey } from "@metaplex-foundation/umi"
import { createNft, fetchDigitalAsset, mplTokenMetadata, TokenStandard, transferV1 } from "@metaplex-foundation/mpl-token-metadata";
import { string, publicKey } from "@metaplex-foundation/umi/serializers";
import wallet from "../wba-wallet.json"
import base58 from "bs58";
import { PublicKey as PKWEB3 } from "@solana/web3.js";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";


const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet.secret_key));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    
    /* const tx = await createNft(umi, {
        mint,
        name: 'WBA Turbin3 7th RUG Cohort',
        uri: 'https://arweave.net/yci6Q_VKDJ6y47uCH4xJ-up0YjzhlJviOxty_fwLAOo',
        sellerFeeBasisPoints: percentAmount(5.5),
    }).sendAndConfirm(umi)

    console.log(tx);
    
    const asset = await fetchDigitalAsset(umi, mint.publicKey)
    console.log(mint.publicKey); */

    const mint = fromWeb3JsPublicKey(new PKWEB3('5SZERf5ba1TWgxU6MXfWqjp4d3bhXyUMKgbGJXwVgEmW'))
    const to = fromWeb3JsPublicKey(new PKWEB3('G5vPmrP8n5LQjoujbqRafiynEB9TrgkibrUGmDyhjGCs'))

    const tx = await transferV1(umi, {
        mint: mint,
        authority: myKeypairSigner,
        tokenOwner: myKeypairSigner.publicKey,
        destinationOwner: to,
        tokenStandard: TokenStandard.NonFungible,
      }).sendAndConfirm(umi)

    console.log(tx);
    // let tx = ???
    // let result = await tx.sendAndConfirm(umi);
    // const signature = base58.encode(result.signature);
    
    // console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint);

    /* console.log(asset); */
})();