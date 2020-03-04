## node-jose-tools Documentation

### Contents

- Tools
  - [addkey](addkey.md) - add a new key to a JWKS
  - [newkey](newkey.md) - create a new JWK key
  - [listkeys](listkeys.md) - list the key ids for all keys in a JWKS
  - [findkey](findkey.md) - find a kid in a JWKS
  - [rmkey](rmkey.md) - remove a kid from a JWKS
  - [thumbprint](thumbprint.md) - generate the thumbprint for a key
  - [info](info.md) - return basic information about a JWT without processing it
  - [info](digest.md) - runs a selected hashing algorithm on the provided data.
  - [sign](sign.md) - creates and signs a JWS for a given payload
  - [verify](verify.md) - verifies a JWS and return the payload
  - [encrypt](encrypt.md) - encrypt a payload into a JWE
  - [decrypt](decrypt.md) - decrypts a JWE and returns the payload
- [Examples](#examples)
  - [Creating new keys](#creating-new-keys)
  - [Adding a key to a key store](#adding-a-key-to-a-keystore)
  - [Add a remote key store locally](#add-a-remote-keystore-locally)
  - [Merging two key stores](#merging-two-keystores)
  - [List the key ids in a key store](#list-the-key-ids-for-all-keys-in-a-keystore)
  - [Remove a key from a key store](#remove-keys-from-a-keystore)
  - [Create a new key and add it to a key store](#create-a-new-key-and-add-it-to-a-keystore)
  - [Create multiple keys](#create-multiple-keys)
  - [Find a key for a key id](#find-the-key-for-a-given-keyid)
  - [Wrap a RFC7800 confirmation key](#wrap-a-rfc7800-confirmation-key)
  - [Create a JWS token](#create-a-jws-token)
  - [Verify a JWS token](#verify-a-jws)
  - [Encrypt a payload using RSA-OAEP and AES126GCM](#encrypt-a-payload-using-rsa-oaep-and-aes126gcm)
  - [Encrypt a string using the dir algorithm](#encrypt-a-string-using-the-dir-algorithm)
  - [Decrypt a JWE for you](#decrypt-a-jwe-for-you)
  - [Create a wrapped JWT using RSA-OAEP and AES126GCM](#create-a-wrapped-jwt-using-rsa-oaep-and-aes126gcm)
  - [Unwrap a JWE and verify an included JWS](#unwrap-a-jwe-and-verify-an-included-jws)

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

This will return the extended key store to ```STDOUT```.

For updating the key store use the following variant:

```
> jose addkey -U -j mykeystore.jwks privatekey.PEM
```

### Add a remote key store locally

This is useful to cache public keys from a server.

```
> jose addkey -j example.jwks https://your.server.host/certs
```

This will return the extended local key store.

Use the ```-U``` flag to update the local key store.

It is possible to read any supported key-format from a URL.

### Merging two keystores

```
> jose addkey -j example.jwks example-priv.jwks
```

Note: if the key stores contain the same key ids, then this will result in duplicate key ids in the key store file.    

Again, use the ```-U``` to store the extended key store into ```mykeystore.jwks```

### List the key ids for all keys in a keystore

```
> jose listkeys -b -j example.jwks
```

This will print one key id per line, so the result will be:

```
[
   "foobar",
   "barfoo",
   "foorsa"
]
```

### Remove keys from a keystore

```
> jose rmkey -b -j example.jwks foorsa
```

This will output a JWKS without the key "foorsa".

```
{
    "keys": [
        {
            "kty":"oct",
            "kid":"foobar",
            "k":"QYPTbIwxRbVuCLU0T3lQWYGP05asffZLAuM1KiNyqj4"
        },
        {
            "kty":"oct",
            "kid":"barfoo",
            "k":"-E_-rcOr6iesQ_BKO21DAuKdblhUmwciIx8Q6gUcUuG42Fw0zdPHPQtfZh19upvrh1Epevwz3Yc2a3YMGCJh1w"
        }
    ]
}
```

If you like to have less spaces in the output, remove the ```-b``` flag.

For updating the key store use the -U or --update flag.

```
> jose rmkey -U -j example.jwks foorsa
```

### Create a new key and add it to a keystore

```
> jose newkey -t oct -s 256 | jose addkey -U -j mykeystore.jwks
```

Alternatively, one can write this command:

```
> jose newkey -t oct -s 256 -U -j mykeystore.jwks
```

Tip: the -q flag silences the command and it will not prompt any other output
than error messages

### Create multiple keys

The -K flag tells the ```newkey``` tool to return the key store instead of an
individual key.

```
> jose newkey -t oct -s 256 -K |  jose newkey -t ec -s 256 -K |  jose newkey -t rsa -s 2048 -K | jose addkey -U -j mykeystore.jwks
```

### Find the key for a given keyid

```
> jose findkey -j example.jwks foobar
```

This will return the private key for the key ```foobar```, if present.

To export the public key, use

```
> jose findkey -p -b -j example-priv.jwks foorsa
```

This results in the following output:

```
{
    "kty":"RSA",
    "kid":"foorsa",
    "e":"AQAB",
    "n":"sFhX2R0ColcUrlU224bzhvCOwngQGGc23BT4btYBtMlM9kEnC_rHpbI45P4LGqGZO-vy8
PK9d9DPtvkdwsc1gxMOe__HoxwSG8aaapEd4NXgMKKXviAJUJbkY7pb9NHvImm6_1ESm6FRT4a
5LdRp5kAJdbfuwkfNRQxzWf-p3wYZoUMxcz3fAdWME55Z7y_YMTIMAI3hbRSw50eaNoY4gggGK
Huz42PrDeclxtQJFI_-nzm7jzEvs_JFIZ0yyTePi4nTOLWNzSFcc43gcfHHOK5okXuiAmZyu-3
voH3rnU85Xb2lkZrQd4Rjxhf6YNYzTzCsmh6Aa2gAloHBqfJU9Q"
}
```

The ```-b``` flag makes the output more readable. If you want a plain JSON string, you can
remove this flag

### Wrap a RFC7800 confirmation key

To wrap the key into RFC7800 key confirmation use:

```
> jose findkey -c -b -j example.jwks foobar
```

This results in:

```
{
    "cnf":{
        "jwk":{
            "kty":"oct",
            "kid":"foobar",
            "k":"QYPTbIwxRbVuCLU0T3lQWYGP05asffZLAuM1KiNyqj4"
        }
    }
}
```

To pass a key reference as a RFC7800 key confirmation use:

```
> jose findkey -b -r -j example.jwks foobar
```

This results in:

```
{
    "cnf":{
        "kid":"foobar"
    }
}
```

### Create a JWS token

```
> jose sign -j example.jwks -a audience -i clientid -l HS256 -k foobar
```

This results in the following compact JWS (linebreaks are inserted for readability):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvb2JhciJ9.eyJleHRyYSI6e30sImlz
cyI6ImNsaWVudGlkIiwiYXVkIjoiYXVkaWVuY2UiLCJzdWIiOiJjbGllbnRpZCIsImlhdCI6MTUxN
DAyMTg5MH0.3n7UkVtMA12ZuQ7fjf0h6FsmPqusTBOrs7N7zNMTcfg
```

Add some extra payload via ```STDIN```.

```
> echo '{"payload": "mypayload"}' | jose sign -j example.jwks -a audience -i clientid -l HS256 -k foobar -p
```

This will result in:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvb2JhciJ9.eyJwYXlsb2FkIjoibXlw
YXlsb2FkIiwiaXNzIjoiY2xpZW50aWQiLCJhdWQiOiJhdWRpZW5jZSIsInN1YiI6ImNsaWVudGlkI
iwiaWF0IjoxNTE0MDIyMTA0fQ.gRSQAU8HcoVnkAcXeeBPGyaFI2qdAD5wsR31AbpkBYc
```

Use the ```-F``` flag to request the flattened JWS format:

```
> jose sign -j example.jwks -a audience -i clientid -l HS256 -k foobar -F
```

will result in:

```
{
    "payload":"eyJleHRyYSI6e30sImlzcyI6ImNsaWVudGlkIiwiYXVkIjoiYXVkaWVuY2UiLCJzdWIiOiJjbGllbnRpZCIsImlhdCI6MTUxNDAyMjIxNX0",
    "protected":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvb2JhciJ9",
    "signature":"XfsZELWK84ZPiANAls8GbeYk7dg06HDDE94YhPT57EY"
}
```

Use the ```-G``` flag to load get the general JWS format.

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
> echo PAYLOADSTRING | jose encrypt -j example.jwks -k foorsa -l RSA-OAEP -e A126GCM -p
```

### Encrypt a string using the dir algorithm

```
> jose encrypt -j example.jwks -k foobar -l dir "hello world"
```

### Decrypt a JWE for you

```
> echo JWETOKENSTRING | jose decrypt -j example-priv.jwks
```

### Create a wrapped JWT (using RSA-OAEP and AES126GCM)

Note that you are free to use any of the other alg/enc combinations if you have the appropriate keys.

```
> jose sign -j example.jwks -a audience -i myid -l HS256 | jose encrypt -j example.jwks -k foorsa -l RSA-OAEP -e A126GCM -p
```

Create a confirmation key for a targeted audience in a wrapped JWT:

```
> jose findkey -k -j example.jwks barfoo | jose sign -j example.jwks -k foobar -a audience -i myid -l HS256 | jose encrypt -j example.jwks -k foorsa -l RSA-OAEP -e A126GCM -p
```

## Unwrap a JWE and verify an included JWS

```
> echo TOKENSTRING | jose decrypt -j example-priv.jwks | jose verify -j example.jwks -a audience -i issuer
```
