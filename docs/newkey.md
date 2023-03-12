## newkey

creates a new key according to the specifications.

SYNOPSIS:

```
> jose newkey -s KEYSIZE [-t KEYTYPE] [-u USAGE] [-j KEYSTORE] [FLAGS]
```

The ```newkey``` tool creates one new key or key-pair. It always returns the private key,
so one can add it to a key store.

By default ```newkey``` returns the newly created private key in JWK format. For
shared keys, it returns the shared key because there is no private key.

The following parameters are supported:

 * ```-s, --size KEYSIZE``` - creates a key for the given ```KEYSIZE``` or curve, if ```EC``` or ```OKP``` keys are requested.

 * ```-t, --type KEYTYPE``` - creates a new key of the provided ```KEYTYPE```. Only ```RSA```, ```oct```, ```EC```, and ```OKP``` are supported values.

 * ```-u, --use USETYPE``` - sets the indented use of a key. Currently `sig` or `enc` are supported. Using `sign` or `encrypt` as use are also accepted. 

 * ```-j, --jwks, --keystore KEYSTORE``` - loads the given ```KEYSTORE```. If this parameter is missing, ```newkey``` tries to load a key store from ```STDIN```. If that fails, then the tool creates a new key store.

 * ```-K, --as-keystore``` - return the new key in JWKS format.

 * ```-q, --quiet``` - generates no output. This flag omits the output of the key store.

 * ```-U, --update``` - updates the provided key store if -j, --jwks, or --keystore is present.

 * ```-r, --RSA, --rsa``` - alternative for --type rsa

 * ```-e, --EC, --ec``` - alternative for --type ec

 * ```-o, --oct, --OCT``` - alternative for --type oct

 * ```-d, --dh, --OKP, --okp``` - alternative for --type okp (RFC8037 D&H keypairs)

 * ```-a, --alg ALG``` - add the alg-claim to the key, for using a key for specific algorithms.

 * ```-b, --beautify``` - pretty print JSON

 Note that ```oct``` require a minimum key size of 256 bit and RSA-keys require a minimum key size of 2048 bit.
