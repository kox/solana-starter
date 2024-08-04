import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import fs from 'fs'
import path from 'path'

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet.secret_key));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        const imageFile = fs.readFileSync(
            path.join(__dirname, '..', '/assets/rug.png')
        )

        const umiImageFile = createGenericFile(imageFile, 'rug.png', {
            tags: [{ name: 'Content-Type', value: 'image/png' }],
          })

        const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
            throw new Error(err)
        })

        console.log(imageUri);


        const metadata = {
             name: "WBA Turbin3 7th Cohor RUG",
             symbol: "WBAT7RUG",
             description: "NFT RUG created during the 7th edition of the WBA Turbin3 Cohor",
             image: imageUri[0],
             external_url: "https://turbin3.com/",
             attributes: [
                 {
                    trait_type: 'cool', 
                    value: '100'
                }
             ],
             properties: {
                 files: [
                     {
                         type: "image/pmg",
                         uri: imageUri[0]
                     },
                 ]
             },
             creators: [{
                address: wallet.pubkey,
                share: 100,
             }]
        }; 

        const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
            throw new Error(err)
          })

        console.log(metadata)
        console.log("Your image URI: ", imageUri[0]);
        console.log("Your metadata URI: ", metadataUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();


// Your image URI:  https://arweave.net/ks89KfXnVANMaFDANA53a6IMzWyZYUtqDoZK6LFfop0
// Your metadata URI:  https://arweave.net/hQXMeTNf3gp2FyT7DTTkwBGvJuuKiuFkzG9604et3R0