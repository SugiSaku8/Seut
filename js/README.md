# Seut
Seut is Socicaly Network For System.
# About
seut can build uniquely designed networks to achieve high performance in a variety of environments.  
The Seut Liquidity Network provides basic tracking via logs with ease.  
The Seut Cell Network offers even more advanced performance, customized for different environments.

Currently, this library allows you to build a liquidity network.

# Usage
1. Installation
Please install via npm.
```bash
npm install seut
```
2. Initialization
First, let's create a new JavaScript file.
In the newly created JavaScript file, input the following content and try running it.
```javascript
const seut = require("seut")
/* Importing the library */
seut.init("MyFastNetwork", "liquidity");
/* Creating/initializing the liquidity network */
```
There should not have been any errors.
3. Execution
Now, let's execute JavaScript through this network.
```javascript
const seut = require("seut")
/* Importing the library */
seut.init("MyFastNetwork", "liquidity");
/* Creating/initializing the liquidity network */
let config = {
    "name": "MyFastNetWork",
    "version": 1.0,
    "network": {
        "type": "liquidity"
    }
}
/* Setting up the network runtime */
let command = `console.log("Hello World!")`
/* Setting the command (program) */
MyFastNetwork.ordar(command, MyFastNetwork, config);
/* Execution */
```

# Author
## Carnation Studio 2024
Development was done by Sugisaku8.
## This software is provided under the MPL 2.0.