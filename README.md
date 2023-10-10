<p align="center">
    <h1 align="center">
      <picture>
        <img width="40" alt="Plurality icon." src="https://github.com/Web3-Plurality/zk-onchain-identity-verification/blob/main/dapp-verifier/verifier-app/src/images/plurality.png">
      </picture>
      Plurality
    </h1>
</p>

| Plurality enables sovereignty over your social reputation by creating an on-ramp of your web2 digital footprint into web3 using verifiable zk-proofs that preserve your privacy. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

By bringing reputation on chain, plurality simplifies onboarding into web3 and enables fun and exciting use cases by reflecting the humanness of the people behind the wallets.

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

A poc of metamask Snaps and basic zk sempahore integration and a basic website for integration were already developed prior to the hackathon.

## What was achieved during the hackathon

We achieved following during the hackathon:

1. Finalization of the concept and consolidation of ideas for the pitch
2. Website development with web2 to web3 onboarding workflows
3. Integration with Lens protocol
4. Integration with Twitter
5. Deployment pipeline to ship the package/containers
6. We deployed the website to public VM with SSL encryption. It can be accessed at: https://plurality.westeurope.cloudapp.azure.com/
7. We published our Metamask Snap to npm package registry so it could be downloaded by everyone to run this demo. Here is the link: https://www.npmjs.com/package/web3-plurality
