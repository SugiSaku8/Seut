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
import { seut } from "seut";
/* Importing the library */
let MyFastNetwork = seut.init("MyFastNetwork", "liquidity");
/* Creating/initializing the liquidity network */
```
There should not have been any errors.
3. Execution
Now, let's execute JavaScript through this network.
```javascript
import { seut } from "seut";
/* Importing the library */
let MyFastNetwork = seut.init("MyFastNetwork", "liquidity");
/* Creating/initializing the liquidity network */
let config = {
    "network": {    
        "version": 1.0,
        "type": "liquidity",
        "true":true
    }
}
/* Setting up the network runtime */
let command = {
    "name": "MyFastNetWork",
    "version": 1.0,
    "type":"geral-cmd",
    command:{
        raw:`Func(console.log("Hello World!"))`,
        cmd:{
            command:`console.log("Hello World!")`
        }
    },
    time:"2024 12 15 9 20"
}
/* Setting the command (program) */
MyFastNetwork.ordar(command, MyFastNetwork, config);
/* Execution */
/* Execution */
```

# Author
## Carnation Studio 2024
Development was done by Sugisaku8.
## This software is provided under the MPL 2.0.