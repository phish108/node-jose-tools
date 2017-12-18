## node-jose toolbox for key management, token signing and encryption

Command line tools for getting the hang of [node-jose's](cisco/node-jose) features.

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
 - listkeys - list the key ids for all keys in a jwks
 - findkey - find a kid in a jwks
 - rmkey - remove a kid from a jwks
 - sign - creates and signs a JWS for a given payload
 - verify - verifies a JWS and return the payload
 - encrypt - encrypt a payload into a JWE
 - decrypt - decrypts a JWE and returns the payload

## Examples

### Creating new keys

```
> node index newkey RSA 2048
> node index newkey oct 256
```

### Adding a key to a keystore

```
> node index addkey -j mykeystore.jwks privatekey.PEM
```

This will return the extended keystore to STDOUT.

For updating the keystore use the following variant:

```
> node index addkey -U -j mykeystore.jwks privatekey.PEM
```

### Merging two keystores

```
> node index addkey -j mykeystore.jwks myotherkeystore.jwks

```

Again, use the -U to store the extended keystore into mykeystore.jwks

### List the key ids for all keys in a keystore

```
> node index listkeys mykeystore.jwks
```

This will print one key ID per line.

#### Remove keys from a keystore

```
> node index rmkey -j mykeystore.jwks foobar
```

This will output a JWKS without the key "foobar". For updating the keystore use
the -U or --update flag.

```
> node index rmkey -U -j mykeystore.jwks foobar
```

#### Create a new key and add it to a keystore

```
> node index newkey oct 256 | node index addkey -U -j mykeystore.jwks
```

#### Find the key for a given keyid

```
> node index findkey -j mykeystore.jwks foobar
```

This will return the private key for the key "foobar", if present.

To export the public key, use

```
> node index findkey -p -j mykeystore.jwks foobar
```

To wrap the key into RFC7800 key confirmation use:

```
> node index findkey -k -j mykeystore.jwks foobar
```

To pass a key reference as a RFC7800 key confirmation use:

```
> node index findkey -r -j mykeystore.jwks foobar
```

### Create a JWS token

```
> node index sign -j mykeystore.jwks -a audience -i clientid
```

Add some extra payload via STDIN.

```
> echo '{"payload": "mypayload"}' | node index sign -j mykeystore.jwks -a audience -i clientid
```

### Verify a JWS

```
> node index verify -j mykeystore.jwks  -a audience -i issuer token.jwt
```

You can also pass the token via stdin:

```
> echo TOKENSTRING | node index verify -j mykeystore.jwks -a audience -i issuer
```

### Encrypt a payload using RSA-OAEP and AES126GCM

```
> echo PAYLOADSTRING | node index encrypt -j mykeystore.jwks -k pubkeyid -l RSA-OAEP -e A126GCM
```

### Decrypt a JWE for you

```
> echo JWETOKENSTRING | node index decrypt -j mykeystore.jwks
```

### Create a wrapped JWT (using RSA-OAEP and AES126GCM)

Note that yo are free to use any of the other alg/enc combinations if you have the appropriate keys.

```
> node index sign -j mykeystore.jwks -a audience -i myid -l HS256 | node index encrypt -j mykeystore.jwks -k audpubkid -l RSA-OAEP -e A126GCM
```

Create a confirmation key for a targeted audience in a wrapped JWT:

```
> node index findkey -k -j mycnfkeys.jwks barbaz | node index sign -j mykeystore.jwks -k foobar -a audience -i myid -l HS256 | node index encrypt -j mykeystore.jwks -k audpubkid -l RSA-OAEP -e A126GCM
```

## Unwrap a JWE and verify the JWS

```
> echo TOKENSTRING | node index decrypt -j mykeystore.jwks | node index verify -j mykeystore.jwks -a audience -i issuer
```
