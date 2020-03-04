## addkey

adds a key to a key store and returns the JWK

SYNOPSIS:

```
> jose addkey [-q -U -C -b --update --quiet --create --beautify] [-j KEYSTORE] [KEYFILE ...]
```

Use this tool for adding keys to a key store. If no key file is provided,
then ```addkey``` reads the key from STDIN.

The tool handles JWK, JWKS, PEM, DER, PKCS#8, PKIX, SPKI, and X509 formats.
If another key store is presented for import, all keys are imported.

The ```addkey``` tool tries to import all provided key files.

The following options and flags are supported:

 * ```-C, --create``` - creates a new key store if the key store file is not present.

 * ```-j, --jwks, --keystore KEYSTORE``` - loads the given ```KEYSTORE```.

 * ```-q, --quiet``` - generates no output. This flag omits the output of the key store.

 * ```-U, --update``` - updates the provided key store.

 * ```-b, --beautify``` - pretty print JSON
