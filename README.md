## node-jose toolbox for key management, token signing and encryption

Command line tools for getting the hang of node-jose's features.

## Installation

Clone this package.

On the command line run ```npm install```. This will install all dependencies.

## Running

```
> node index TOOL [OPTIONS]
```

The following tools are supported:

 - addkey - add a new key to a jwks
 - newkey - create a new key (that can be used by addkey)
 - findkey - find a kid in a jwks
 - rmkey - remove a kid from a jwks
 - sign - creates and signs a JWS for a given payload
 - verify - verifies a JWS and return the payload

Not yet done:

 - encrypt - encrypt a payload into a JWE
 - decrypt - decrypts a JWE and returns the payload
