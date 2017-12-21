## node-jose toolbox for key management, token signing and encryption

Command line tools for getting the hang of the [cisco/node-jose](https://github.com/cisco/node-jose) features.

## Installation

Clone this package.

On the command line run ```npm install```. This will install all dependencies.

## Running

```
> jose TOOL [OPTIONS]
```

The following tools are supported:

 - addkey - add a new key to a jwks
 - newkey - create a new key (that can be used by addkey)
 - listkeys - list the key ids for all keys in a jwks
 - findkey - find a kid in a jwks
 - rmkey - remove a kid from a jwks
 - sign - creates and signs a JWS for a given payload
 - verify - verifies a JWS and return the payload
 - encrypt - encrypt a payload into a JWE
 - decrypt - decrypts a JWE and returns the payload

This package installs the jose script into your system.

## Examples

### Creating new keys

```
> jose newkey -t RSA -s 2048
> jose newkey -t oct -s 256
```

### Adding a key to a keystore

```
> jose addkey -j mykeystore.jwks privatekey.PEM
```

This will return the extended keystore to STDOUT.

For updating the keystore use the following variant:

```
> jose addkey -U -j mykeystore.jwks privatekey.PEM
```

### Merging two keystores

```
> jose addkey -j mykeystore.jwks myotherkeystore.jwks

```

Again, use the -U to store the extended keystore into mykeystore.jwks

### List the key ids for all keys in a keystore

```
> jose listkeys mykeystore.jwks
```

This will print one key ID per line.

#### Remove keys from a keystore

```
> jose rmkey -j mykeystore.jwks foobar
```

This will output a JWKS without the key "foobar". For updating the keystore use
the -U or --update flag.

```
> jose rmkey -U -j mykeystore.jwks foobar
```

#### Create a new key and add it to a keystore

```
> jose newkey -t oct -s 256 | jose addkey -U -j mykeystore.jwks
```

#### Find the key for a given keyid

```
> jose findkey -j mykeystore.jwks foobar
```

This will return the private key for the key "foobar", if present.

To export the public key, use

```
> jose findkey -p -j mykeystore.jwks foobar
```

To wrap the key into RFC7800 key confirmation use:

```
> jose findkey -k -j mykeystore.jwks foobar
```

To pass a key reference as a RFC7800 key confirmation use:

```
> jose findkey -r -j mykeystore.jwks foobar
```

### Create a JWS token

```
> jose sign -j mykeystore.jwks -a audience -i clientid
```

Add some extra payload via STDIN.

```
> echo '{"payload": "mypayload"}' | jose sign -j mykeystore.jwks -a audience -i clientid
```

### Verify a JWS

```
> jose verify -j mykeystore.jwks  -a audience -i issuer token.jwt
```

You can also pass the token via stdin:

```
> echo TOKENSTRING | jose verify -j mykeystore.jwks -a audience -i issuer
```

### Encrypt a payload using RSA-OAEP and AES126GCM

```
> echo PAYLOADSTRING | jose encrypt -j mykeystore.jwks -k pubkeyid -l RSA-OAEP -e A126GCM
```

### Decrypt a JWE for you

```
> echo JWETOKENSTRING | jose decrypt -j mykeystore.jwks
```

### Create a wrapped JWT (using RSA-OAEP and AES126GCM)

Note that yo are free to use any of the other alg/enc combinations if you have the appropriate keys.

```
> jose sign -j mykeystore.jwks -a audience -i myid -l HS256 | jose encrypt -j mykeystore.jwks -k audpubkid -l RSA-OAEP -e A126GCM
```

Create a confirmation key for a targeted audience in a wrapped JWT:

```
> jose findkey -k -j mycnfkeys.jwks barbaz | jose sign -j mykeystore.jwks -k foobar -a audience -i myid -l HS256 | jose encrypt -j mykeystore.jwks -k audpubkid -l RSA-OAEP -e A126GCM
```

## Unwrap a JWE and verify the JWS

```
> echo TOKENSTRING | jose decrypt -j mykeystore.jwks | jose verify -j mykeystore.jwks -a audience -i issuer
```
