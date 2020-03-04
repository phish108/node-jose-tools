## listkeys

lists all key ids in a given key store.

SYNOPSIS

```
> jose listkeys -j KEYSTORE [-b]
```

The tool accepts the ```-j```, ```--jwks```, and ```--keystore``` parameters. If
no key store is provided, then ```listkeys``` will try to read the key store
from ```STDIN```. The key store must be provided in JWKS format.

The result will be a JSON array that contains the key ids.
