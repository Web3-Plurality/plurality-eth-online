import express, { Request, Response } from "express";
import Bundlr from "@bundlr-network/client";

export const permawebRouter = express.Router();
const TOP_UP = '100000000000000000'; // 0.1 MATIC
const MIN_FUNDS = 0.05;

// POST 
permawebRouter.post("/", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        // For Polygon / Matic testnet
        const bundlr = new Bundlr("https://devnet.bundlr.network", "matic", process.env.SIGNER_PRIVATE_KEY, {
	        providerUrl: "https://rpc-mumbai.maticvigil.com",
        });
        await bundlr.ready()
        let balance = await bundlr.getLoadedBalance()
        let readableBalance = bundlr.utils.fromAtomic(balance).toNumber()
        console.log("Readable balance: "+readableBalance);

        if (readableBalance < MIN_FUNDS) {
            console.log("Topping up");
            await bundlr.fund(TOP_UP);
            
            balance = await bundlr.getLoadedBalance()
            readableBalance = bundlr.utils.fromAtomic(balance).toNumber()
            console.log("Updated balance: "+readableBalance);
        }

        const tx = await bundlr.upload(JSON.stringify(data), {
            tags: [{ name: 'Content-Type', value: 'application/json' }],
        })
        res.status(200).send({ url: `https://arweave.net/${tx.id}` }).json();

	} catch (e) {
		//console.log(e);
        res.status(500).send(e);
	}
  });

  permawebRouter.post("/interests", async (req: Request, res: Response) => {
    try {
      console.log("In interests!!!");
        const data = req.body;
        const bundlr = new Bundlr("https://devnet.bundlr.network", "matic", process.env.SIGNER_PRIVATE_KEY, {
	        providerUrl: "https://rpc-mumbai.maticvigil.com",
        });
        await bundlr.ready()
        console.log("Bundlr ready");
        let balance = await bundlr.getLoadedBalance();
        console.log(balance);
        let readableBalance = bundlr.utils.fromAtomic(balance).toNumber();
        console.log("Readable balance: "+readableBalance);

        if (readableBalance < MIN_FUNDS) {
            console.log("Topping up");
            await bundlr.fund(TOP_UP);
            
            balance = await bundlr.getLoadedBalance()
            readableBalance = bundlr.utils.fromAtomic(balance).toNumber()
            console.log("Updated balance: "+readableBalance);
        }

        const tx = await bundlr.upload(JSON.stringify(data), {
            tags: [{ name: 'Content-Type', value: 'application/json' }],
        })
        res.status(200).send({ url: `https://arweave.net/${tx.id}` }).json();

	} catch (e) {
		//console.log(e);
        res.status(500).send(e);
	}
  });

  // POST via IPFS
/*permawebRouter.post("/", async (req: Request, res: Response) => {
  try {
      const data = req.body;
      console.log(data);
      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      const resp = await axios.post(
        url,
        {
          pinataMetadata: {
            name: "test",
          },
          // assuming client sends `nftMeta` json
          pinataContent: data,
        },
        {
          headers: {
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_API_SECRET,
          },
        }
      );
      console.log(resp.data.IpfsHash);
      //const pinataobj = resp.data.IpfsHash;
      res.status(200).send({ url: `https://ipfs.io/ipfs/${resp.data.IpfsHash}` }).json();

} catch (e) {
  //console.log(e);
      res.status(500).send(e);
}
});*/