## findkey

finds a key id in a key store and returns the JWK

SYNOPSIS:

```
> jose findkey [-q -r -k -p -b --cnfkey --cnfref --public --quiet --beautify] [-j KEYSTORE] KEYID
```

The tool ```findkey``` finds and returns a key from a key store. If the key is present, then
the JWK is returned in the requested format. If the key id is not found, then ```findkey``` returns an error.

By default ```findkey``` returns the key as it is stored in the key store.

The following options are accepted for manipulating the output.

 * ```-j, --jwks, --keystore KEYSTORE``` - loads the given ```KEYSTORE```. If no key store is provided, the key store is loaded from ```STDIN```.

 * ```-c, --cnfkey``` - returns a RFC7800 confirmation key. This will include the key of octet keys. For all other keys the public key is returned. This will throw an error, if the key id does not point to a private key.

 * ```-k, --kid KEYID``` - OPTIONAL the key id to return. This option is for compliance with other tools.

 * ```-p, --public``` - returns the public key instead of a private key. If the key is a public key, this option does nothing.

 * ```-q, --quiet``` - generates no output. This flag is ideal to verify the presence of a key without obtaining it.

 * ```-r, --cnfref``` - returns a RFC7800 confirmation key reference. This will throw an error, if the keyid does not refer to a private key.

 * ```-b, --beautify``` - pretty print JSON

If no key store is provided, ```findkey``` will load the the key store from ```STDIN```,
this allows to pipe directly from the ```addkey``` tool.
