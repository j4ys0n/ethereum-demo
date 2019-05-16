# ethereum demo

DO NOT RUN IN PRODUCTION, this is for demonstration purposes only and learning how to work with the Ethereum blockchain.

### setup

Make sure you're on node 11.2 (more recent versions may work also).

I prefer to use [nvm](https://github.com/nvm-sh/nvm).

(`nvm ls` - and potentially `nvm install 11.2` or `nvm use 11.2`)

`git clone `

`npm install`

There's a bug or incompatibility with angular 6 and web3. This could probably be fixed correctly by updating all modules to their latest versions, but here's how to hack the current issue and get this running:

go to: `node_modules/@angular-devkit/build-angular/src/models/webpack-configs/browser.js` and scroll to the bottom.

before this line: `exports.getBrowserConfig = getBrowserConfig;` change `node: ...` to `node: { crypto: true, stream: true, fs: 'empty', net: 'empty' }` (this is probably line 133).

#### ethereum node

You will need an Ethereum node running on `localhost` with the websocket port open (`8546`) (you can change this but `localhost` is hardcoded). I like Parity but geth will also work. It's pretty easy to run a parity node with docker and there's a Dockerfile included to to that. Make sure you have [Docker CE](https://docs.docker.com/install/) installed and then run the following from the root directory of this project.

`docker build -t eth .`

this will keep the node container running in the foreground and you can stop it with `ctrl + c`.

`docker run -it eth`

this will run the node in the background (daemon).

`docker run -d --name eth eth`

and you can stop the daemonized node container with:

`docker stop eth && docker rm eth`

#### front end

`npm start`
