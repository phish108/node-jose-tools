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

## Tools

### addkey

adds a key to a keystore and returns the JWK

SYNOPSIS:

```
> jose addkey [-q -U -C --update --quiet --create] [-j KEYSTORE] [KEYFILE ...]
```

Use this tool for adding keys to a keystore. If no keyfile is provided,
then ```addkey``` reads the key from STDIN.

The tool handles JWK, JWKS, PEM, DER, PKCS#8, PKIX, SPKI, and X509 formats.
If another keystore is presented for import, all keys are imported.

The ```addkey``` tool tries to import all provided keyfiles.

The following options and flags are supported:

 * ```-C, --create``` - creates a new keystore if the keystore file is not present.

 * ```-j, --jwks, --keystore KEYSTORE``` - loads the given keystore.

 * ```-q, --quiet``` - generates no output. This flag omits the output of the keystore.

 * ```-U, --update``` - updates the provided keystore.

### newkey

creates a new key according to the secifiations.

SYNOPSIS:

```
> jose newkey -s KEYSIZE [-t KEYTYPE] [-u USAGE] [-j KEYSTORE] [FLAGS]
```

The ```newkey``` allows to create one key or key-pair. It always returns the private key,
so one can add it to a keystore.

By default ```newkey``` returns the newly created private key in JWK format.

The following parameters are supported:

 * ```-s, --size KEYSIZE``` - creates a key for the given keysize or curve, if ```EC``` or ```OKP``` keys are requested.

 * ```-t, --type KEYTYPE``` - creates a new key of the provided key type. Only ```RSA```, ```oct```, ```EC```, and ```OKP``` are supported values.

 * ```-j, --jwks, --keystore KEYSTORE``` - loads the given keystore. If this parameter is missing ```newkey``` tries to load a keystore from ```STDIN```. If that fails, then a new keystore is created.

 * ```-K, --as-keystore``` - return the new key in JWKS format.

 * ```-q, --quiet``` - generates no output. This flag omits the output of the keystore.

 * ```-U, --update``` - updates the provided keystore if -j, --jwks, or --keystore is present.

 * ```-r, --RSA, --rsa``` - alternative for --type rsa

 * ```-e, --EC, --ec``` - alternative for --type ec

 * ```-o, --oct, --OCT``` - alternative for --type oct

 * ```-d, --dh, --OKP, --okp``` - alternative for --type okp (RFC8037 D&H keypairs)

 Note that ```oct``` require a minimum keysize of 256 bit and RSA-keys require a
 minimum keysize of 2048 bit.

### listkeys

lists all keyids in a given keystore.

SYNOPSIS

```
> jose listkeys -j KEYSTORE
```

The tool accepts the ```-j, --jwks, and --keystore``` parameters. If no keystore is
provided, then ```listkeys``` will try to read the keystore from ```STDIN```.

### findkey

finds a key id in a keystore and returns the JWK

SYNOPSIS:

```
> jose findkey [-q -r -k -p --cnfkey --cnfref --public --quiet] [-j KEYSTORE] KEYID
```

The tool ```findkey``` finds and returns a key from a keystore. If the key is present, then
the JWK is returned in the requested format. If the keyid is not found, then
findkey returns an error.

By default ```findkey``` returns the key as it is stored in the keystore.

The following options are accepted for manipulating the output.

 * ```-j, --jwks, --keystore KEYSTORE``` - loads the given keystore. If no keystore is provided, the keystore is loaded from ```STDIN```.

 * ```-c, --cnfkey``` - returns a RFC7800 confirmation key. This will include the key of octet keys. For all other keys the public key is returned. This will throw an error, if the keyid does not refer to a private key.

 * ```-k, --kid KEYID``` - OPTIONAL the key id to return. This option is for compliance with other tools.

 * ```-p, --public``` - returns the public key instead of a private key. If the key is a public key, this option does nothing.

 * ```-q, --quiet``` - generates no output. This flag is ideal to verify the presence of a key without obtaining it.

 * ```-r, --cnfref``` - returns a RFC7800 confirmation key reference. This will throw an error, if the keyid does not refer to a private key.

If no keystore is provided, findkey will load the the keystore from ```STDIN```,
this allows to pipe directly from the ```addkey``` tool.

### rmkey

removes a key with the provided keyid from the provided keystore

SYNOPSIS

```
> jose rmkey KEYID [-j KEYSTORE] [-U --update -q --quiet]
```

The tool ```rmkey``` allows to remove multiple keys in one got. In this case each key id must
be provided in a separate line of the ```KEYID```-string. If no ```KEYID``` is provided, ```rmkey``` tries to load the ```KEYID``` from the command line. Alternatively, ONE keyid can be passed using the ```-k``` or ```--kid``` option.   

 * ```-j, --jwks, --keystore KEYSTORE``` - loads the given keystore. If this parameter is missing newkey tries to load a keystore from ```STDIN```. If that fails, then ```rmkey``` fails with an error

 * ```-k, --kid KEYID``` - the key id in the keystore to be used in this operation.

 * ```-q, --quiet``` - generates no output. This flag omits the output of the keystore.

 * ```-U, --update``` - updates the provided keystore if ```-j, --jwks```, or ```--keystore``` is present.

By default ```rmkey``` returns the updated keystore on ```STDOUT```. If ```-j, --jwks``` or ```--keystore``` is provided, then the ```-U``` flag will overwrite the provided keystore.

### sign

creates a signed JWS token.

SYNOPSIS:

```
> jose sign -j KEYSTORE -l ALG -k KEYID -i ISSUER -a AUDIENCE [FLAGS] [PAYLOADFILE]
```

One can pass a payload via ```STDIN``` to the ```sign``` tool (e.g., the output of findkey).

By default, ```sign``` will return the JWS in compact format.

The following parameters are accepted.

 * ```-a, --aud AUDIENCE``` - the target of the JWS that will verify the token

 * ```-F, --flat, --flattened``` - return the JWS as flattened JSON.

 * ```-G, --general, --json, --JSON``` - return the JWS in the full JSON format.

 * ```-i, --issuer ISSUER``` - the issuer of the JWS (probably used by the audience)

 * ```-j, --jwks, --keystore KEYSTORE``` - the keystore that contains the singing keys.

 * ```-k, --kid KEYID``` - the key id in the keystore to be used in this operation.

 * ```-l, --alg JWA``` - the signing algorithm (e.g., ```HS256```).

 * ```-N, --no-reference``` - indicates that the header must not contain a reference to the key.

 * ```-x, --exp TIMEOUT``` - add a validity timeout in seconds from now.


### verify

verifies a signed JWS token and returns the payload

SYNOPSIS:

```
> jose verify -j KEYSTORE -i ISSUER -a AUDIENCE
```

One can pass a payload via ```STDIN``` to the ```sign``` tool (e.g., the output of findkey).

The following parameters are accepted.

 * ```-a, --aud AUDIENCE``` - the target of the JWS that will verify the token

 * ```-i, --issuer ISSUER``` - the issuer of the JWS

 * ```-j, --jwks, --keystore KEYSTORE``` - the keystore that contains the singing keys.

### encrypt

creates a JWE token.

SYNOPSIS:

```
> jose ecrypt -j KEYSTORE -l ALG -e ENC -k KEYID [PAYLOADFILE]
```

One can pass a payload via ```STDIN``` to the ```encrypt``` tool (e.g., the output of findkey).

The following parameters are accepted.

 * ```-j, --jwks, --keystore KEYSTORE``` - the keystore that contains the singing keys.

 * ```-k, --kid KEYID``` -

 * ```-l, --alg JWA_KEY_ENCCRYPT``` -

 * ```-e, --enc JWA_CONTENT_ENCRYPT``` -

 * ```-a, --aud AUDIENCE``` - OPTIONAL the audience of the token. ```encrypt``` tries to determine the audience from the payload (e.g. if a JWS is passed). If no audience is given and ```encrypt``` cannot determine the aud automatically , then the tools ends with an error.

### decrypt

decrypts a JWE token and returns the payload.

SYNOPSIS:

```
> jose decrypt -j KEYSTORE [PAYLOADFILE]
```

One can pass a payload via ```STDIN``` to ```decrypt``` (e.g., the output of ```encrypt```).

The following parameters are accepted.

 * ```-j, --jwks, --keystore KEYSTORE``` - the keystore that contains the singing keys.

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
> jose listkeys example.jwks
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

Alternatively, one can write this command:

```
> jose newkey -t oct -s 256 -U -j mykeystore.jwks
```

Tipp: the -q flag silences the command and it will not promt any other output
than error messages

#### Create multiple keys

The -K flag tells the newkey command to return the keystore instead of an
individual key.

```
> jose newkey -t oct -s 256 -K |  jose newkey -t ec -s 256 -K |  jose newkey -t rsa -s 2048 -K | jose addkey -U -j mykeystore.jwks
```

#### Find the key for a given keyid

```
> jose findkey -j example.jwks foobar
```

This will return the private key for the key "foobar", if present.

To export the public key, use

```
> jose findkey -p -j example.jwks foobar
```

To wrap the key into RFC7800 key confirmation use:

```
> jose findkey -c -j example.jwks foobar
```

To pass a key reference as a RFC7800 key confirmation use:

```
> jose findkey -r -j example.jwks foobar
```

### Create a JWS token

```
> jose sign -j example.jwks -a audience -i clientid -l HS256 -k foobar
```

Add some extra payload via STDIN.

```
> echo '{"payload": "mypayload"}' | jose sign -j example.jwks -a audience -i clientid -l HS256 -k foobar
```

### Verify a JWS

```
> jose verify -j example.jwks  -a audience -i issuer token.jwt
```

You can also pass the token via stdin:

```
> echo TOKENSTRING | jose verify -j example.jwks -a audience -i issuer
```

### Encrypt a payload using RSA-OAEP and AES126GCM

```
> echo PAYLOADSTRING | jose encrypt -j example.jwks -k pubkeyid -l RSA-OAEP -e A126GCM
```

### Decrypt a JWE for you

```
> echo JWETOKENSTRING | jose decrypt -j example.jwks
```

### Create a wrapped JWT (using RSA-OAEP and AES126GCM)

Note that yo are free to use any of the other alg/enc combinations if you have the appropriate keys.

```
> jose sign -j example.jwks -a audience -i myid -l HS256 | jose encrypt -j example.jwks -k foorsa -l RSA-OAEP -e A126GCM
```

Create a confirmation key for a targeted audience in a wrapped JWT:

```
> jose findkey -k -j example.jwks barbaz | jose sign -j example.jwks -k foobar -a audience -i myid -l HS256 | jose encrypt -j example.jwks -k foorsa -l RSA-OAEP -e A126GCM
```

## Unwrap a JWE and verify the JWS

```
> echo TOKENSTRING | jose decrypt -j example-priv.jwks | jose verify -j example-priv.jwks -a audience -i issuer
```
