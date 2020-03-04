## sign

creates a signed JWS token.

SYNOPSIS:

```
> jose sign -j KEYSTORE -l ALG -k KEYID -i ISSUER -a AUDIENCE [FLAGS] [-p [PAYLOADFILE]] [--header claim=value]
```

One can pass a payload via ```STDIN``` to the ```sign``` tool (e.g., the output of ```findkey```).

By default, ```sign``` will return the JWS in compact format.

The following parameters are accepted.

  * ```-a, --aud AUDIENCE``` - the target of the JWS that will verify the token

  * ```-F, --flat, --flattened``` - return the JWS as flattened JSON.

  * ```-G, --general, --json, --JSON``` - return the JWS in the full JSON format.

  * ```-i, --issuer ISSUER``` - the issuer of the JWS (probably used by the audience)

  * ```-j, --jwks, --keystore KEYSTORE``` - the ```KEYSTORE``` that contains the singing keys.

  * ```-k, --kid KEYID``` - the key id in the key store that this operation should use. This MUST be a private key.

  * ```-K, --key JWK``` - pass a ```JWK``` formatted key directly. This will ignore any provided keystore-key id pair.

  * ```-l, --alg JWA``` - the signing algorithm (e.g., ```HS256```).

  * ```-N, --no-reference``` - indicates that the header must not contain a reference to the key.

  * ```-p, --payload``` - indicates to load a payload file. If no payload filename has been passed, then ```sign``` will load the payload from ```STDIN```.

  * ```-x, --exp TIMEOUT``` - add a validity timeout in seconds from now.

  * ```-b, --beautify``` - pretty print JSON

  * ```--header claim=value``` - adds an extra claim to the protected header. It is possible to pass this option multiple times to add all extra headers. This option parses JSON values and adds them correctly, in this case appropriate quote are required.
