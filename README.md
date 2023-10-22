<p align="center">
    <h1 align="center">
      <picture>
        <img width="40" alt="Plurality icon." src="https://github.com/Web3-Plurality/zk-onchain-identity-verification/blob/main/dapp-verifier/verifier-app/src/images/plurality.png">
      </picture>
      Plurality
    </h1>
</p>

|Note: This repository also contains a submodule repository i.e. [plurality-interests-subgraph](https://github.com/Web3-Plurality/plurality-interests-subgraph). This subgraph was developed during this hackathon and should be considered for evaluation.  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

Plurality is a web3 onboarding protocol that enables the social media users and content creators to migrate to blockchain based web3 social networks by linking, verifying and aggregating their existing social reputation and interests.

By bringing reputation and interests on chain, plurality simplifies onboarding into web3 and enables fun and exciting use cases by reflecting the humanness of the people behind the wallets.

# Live demo

The live demo can be viewed on this link:
https://plurality.westeurope.cloudapp.azure.com/

# How to run

You can either use docker or yarn to run this:

## Yarn

```shell
yarn install-all && yarn start
```

If everything builds correctly the website should be accessible at

```shell
https://localhost:8000
```

## Docker

```shell
docker-compose up
```

If everything builds correctly the website should be accessible at

```shell
https://localhost:8000
```

## Snaps is pre-release software

You will need to install metamask flask to run this demo. Don't worry on the UI it will show you the button to download.
**Important** Do not install Flask and normal Metamask in same browser profile. We recommend to use a different browser or a different browser profile.

## What did we have prior to the hackathon
 
A boilerplate code base with following functions was already developed prior to the hackathon started:

1. A PoC of metamask Snaps and basic zk sempahore integration already opensourced
2. A basic website for integration with Lens boiler plate code
3. A basic PoC of OAuth with twitter

For transparency, we have maintained full version control with detailed commit history to clearly represent what was developed during the hackathon.

## What was achieved during the hackathon

We achieved following during the hackathon:

1. Finalization of the concept and consolidation of ideas for the pitch along with a [Whitepaper draft](WhitepaperDraft.md)
2. Web2 to Web3 onboarding workflows
3. Web3 Integration with Orbis protocol
4. OAuth Integration with Facebook
5. Integration with Facebook Graph API to capture interests
6. Deployment pipeline to ship the package/containers
7. We deployed the website to public VM with SSL encryption. It can be accessed at: https://plurality.westeurope.cloudapp.azure.com/
8. We published our Metamask Snap to npm package registry so it could be downloaded by everyone to run this demo. Here is the link: https://www.npmjs.com/package/web3-plurality
9. We developed a subgraph to index the offchain data of user's interests and providing this anonymously to earn rewards
10. We developed a PoC to explain how the subgraph can be used to process user interests in an example case of Advertisements