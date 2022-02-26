# Vote for the better color!
### An interactive web3 project
Try it out at https://0xrootbeet.github.io/color-vote using the *Rinkeby* testnet.

I made this as part of Cadena's **Ethereum 101** course, using the bank dapp as a base.
The dapp was built with React, without a CSS framework.
It allows anyone to assign their (testnet) Ether to vote for blue or red as the better color, or a combination of the two.
This amount can be withdrawn as well, and the current balances are shown at the top of the screen.

#### Please note these potential bugs
If you are contributing very small amounts (on the scale of 1e-18), JavaScript float operations may lead to imprecise values.
To reload the running balance, you will need to press the buttons to disconnect and reconnect your account to refresh the stats.
