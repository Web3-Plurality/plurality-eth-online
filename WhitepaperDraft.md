### Vision

Plurality is a web3 onboarding protocol that enables the social media users and content creators to migrate to blockchain based web3 social networks by linking, verifying and aggregating their existing social reputation and interests.

### Description

### **Current Problems**

**Your online reputation is your social capital but can be taken away from you at any time.**

Human interactions are becoming remote. We increasingly make decisions based on someone’s online presence, which can also be called as their “social reputation”. For example, if you want to hire someone, you will view their LinkedIn. If you want to get some plumbing done in your home, you will call whoever has 5 stars on google. If you want to improve yourself, you will follow influencers with huge following. In short, even small interactions with other people in our daily life are influenced by the reputation we see online. Therefore, it is now more important than ever to guard your social capital as it has the power to influence not only your personal lives, but also your professional life and potential business opportunities. Currently, your social capital is in the forms of your various web2 profiles in the hands of a few centralized providers. Your profile can be blocked, censored or taken down without any consideration of the years of effort you might have done to build it. Your reputation or your social capital is not truly your own.

**Web3 offers a better alternative, however, adoption remains extremely low**

Considering such circumstances, an alternative way of bringing together communities is being built – known as web3 social. On web3 social media platforms, users can truly own their content, earn based on the quality they offer and remain free from any external manipulation. However, the adoption remains extremely low. Lens, which is one of the famous web3 social platforms, has only 125k active profiles as of yet. Which is peanuts as compared to the 4.8 billion users who use web2 social media platforms.

**Low adoption in web3 socials means low adoption of blockchain overall**

Currently only 4% of the world uses web3 technologies. But time and again, we have seen that users on any platform grow when they are engaged. On blockchain, crypto kitties was the first experiment which encourage users to engage with the web3 platform, and it basically broke Ethereum. Therefore, we need to bring people on web3 and keep them engaged. Something that web3 social might be able to do.

**_We need people not addresses on chain_**

### **Plurality’s Solution**

If we need to increase the adoption of blockchain overall, we need to increase adoption of web3 socials. Plurality’s team figured out 3 problems that are currently hindering users from moving to web3 socials.

1. **Complicated onboarding**: The average user doesn’t want to download multiple wallets to interact with web3, therefore, our solution aims to reduce the existence of wallet.
2. **Lack of personalization**: Web3 experience is bland and not as rich as the alternate web2 platforms. We all have spent years curating our interests on web2 providers which web3 doesn’t have. We intend to reuse the reputation and interests’ information from web2 and use them in web3, all while preserving the privacy of user.
3. **No network on web3**: You want to be where your network is, therefore, we intend to create an incentivization mechanism to bring your users with you to the fascinating world of web3.

### **How it works?**

1. On the plurality portal, the user logs into their web2 profiles and creates zk proof of ownership. The secrets corresponding to zk proof are stored locally in user’s MetaMask. This is done by using a metamask snap.
2. User then allows to fetch its reputation and interests from its web2 profiles. User sees what interests are picked, and it can add, remove or delete the interests.
3. The selected user reputation and interests are then linked on the web3 social platforms in a privacy preserving way using zk proofs. Currently, we support Lens and Orbis.
4. Finally, user is incentivized to invite their network to join them on web3 platforms.

![image](https://github.com/Web3-Plurality/plurality-eth-online/assets/8026367/4ff4fcb4-77c9-4a16-b137-0bec11e6b33c)


### **Technologies Used**

1. _OAuth:_ For proving that the user is actually the owner of the web2 account. We currently support twitter and facebook profiles.
2. _Web2 APIs_: Graph API is used to fetch interests.
3. _Semaphore by Ethereum Privacy Scaling Explorations team:_ For Zk-membership proofs
4. _Metamask Snap:_ For storing zk secrets. We use MetaMask to reduce friction because it already has a huge userbase and we don't want users to download an extra wallet.
5. _Web3 Social Integration:_ For connecting interests and reputation from web2 socials to web3 socials. We currently support Lens and Orbis web3 social platforms.
6. _Social Interests Subgraph:_ A subgraph is developed to index the offchain data of user's interests and providing this anonymously to earn rewards
6. _React/Typescript:_ For frontend and backend.
7. _Solidity:_ for smart contract

### **Use cases enabled by Plurality**

Plurality can open doors for plethora of new applications. For example:

1. Interest based recommendation systems
2. Decentralized communities formed on common interests between participants
3. Self-sovereign web3 advertisements that would show ads to only those users who have opted into ads based on the interests they have chosen to reveal.
4. Reputation based staking allowing individuals to stake web3 assets by proving that they are a reputable individual
5. Web3 creator economy allowing users to bring their reputation from web2 to prove that they can do what they are claiming to be able to do
6. Credibility based information allowing opinions of credible individuals to have precedence over unrelated publications, leading to lesser fake news and propaganda.

### **Conclusion**

Adoption of web3 social platforms is low, which poses hurdles to adoption of web3 overall. This needs to be fixed by providing users easy to onboard mechanisms and personalized experience from day 0. Plurality intends to solve this with its privacy preserving linking mechanism between web2 and web3 worlds.

We believe that Plurality could ease onboarding process and allow users to have an engaged community and interesting content on web3 from day 0 of onboarding, greatly increasing the user experience and retention on web3 platforms. Our incentivized mechanism to retain communities will allow us to reduce the cold start problem of web3 dApps.