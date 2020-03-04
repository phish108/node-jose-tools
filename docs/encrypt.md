## encrypt

creates a JWE token.

SYNOPSIS:

```
> jose encrypt -j KEYSTORE -l ALG -e ENC -k KEYID [-p [PAYLOADFILE]] [--header claim=value]
```

One can pass a payload via ```STDIN``` to the ```encrypt``` tool (e.g., the output of ```findkey```).

The following parameters are accepted.

 * ```-j, --jwks, --keystore KEYSTORE``` - the ```KEYSTORE``` file that contains the singing keys.

 * ```-k, --kid KEYID``` - the ```KEYID``` of the key that should be used for encryption. This MUST refer to a public key.

 * ```-l, --alg JWA_KEY_ENCCRYPT``` - the key encryption algorithm as specified for JWA

 * ```-e, --enc JWA_CONTENT_ENCRYPT``` - The content encryption algorithm as specified for JWA.

 * ```-F, --flat, --flattened``` - return the JWS as flattened JSON.

 * ```-G, --general, --json, --JSON``` - return the JWS in the full JSON format.

 * ```-a, --aud AUDIENCE``` - OPTIONAL the audience of the token. ```encrypt``` tries to determine the audience from the payload (e.g. if a JWS is passed). If no audience is given and ```encrypt``` cannot determine the ```aud``` automatically , then the tools ends with an error.

  * ```-p, --payload``` - indicate that the last argument is a filename and not the actual payload. If this flag is used and no additional argument is provided the, then the payload is read from ```STDIN```.

  * ```--header claim=value``` - adds an extra claim to the protected header. It is possible to pass this option multiple times to add all extra headers. This option parses JSON values and adds them correctly, in this case appropriate quote are required.
