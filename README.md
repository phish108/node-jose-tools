## node-jose-tools for JOSE key management, token signing and encryption

![Tests](https://github.com/phish108/node-jose-tools/workflows/Node.js%20CI/badge.svg)

The Swiss-army knife tool for [node-jose](https://github.com/cisco/node-jose) for handling JSON Web Tokens.

### Overview

`node-jose-tools` provides a simple CLI through the ```jose``` command for
[JSON web-key (JWK)](https://tools.ietf.org/html/rfc7517) key and key store management as well as for handling
[JSON web-tokens (JWT)](https://tools.ietf.org/html/rfc7519) in, both, the signed and encrypted variants.

The `jose` command allows quick feature testing of node-jose functions. 

`node-jose-tools` have started to learn better about the different features of node-jose. It also provides reference implementations to many of the underlying functions. The tools and functions are separated to allow easy extension and quick orientation for how the different library features work.

### Supported platforms and node versions

`node-jose-tools` are tested with node versions 12, 13, 14, and 15 on linux (ubuntu), Windows, and macOS. 

It is recommended to use node version 12 or higher, due to the *much* better performance of the cryptographic functions.

### Installing

On the command line run ```npm install -g node-jose-tools```.

### Running

Open your favorite shell and type.

```
> jose TOOL [OPTIONS]
```

The following tools are supported:

Key management
 - [addkey](docs/addkey.md) - add a new key to a jwks
 - [newkey](docs/newkey.md) - create a new key (that can be used by addkey)
 - [listkeys](docs/listkeys.md) - list the key ids for all keys in a jwks
 - [findkey](docs/findkey.md) - find a kid in a jwks
 - [rmkey](docs/rmkey.md) - remove a kid from a jwks
 - [thumbprint](docs/thumbprint.md) - generate key thumbprints and key-ids
 - [info](docs/info.md) - return basic information about a JWT without processing it
 - [sign](docs/sign.md) - creates and signs a JWS for a given payload
 - [verify](docs/verify.md) - verifies a JWS and return the payload
 - [encrypt](docs/encrypt.md) - encrypt a payload into a JWE
 - [decrypt](docs/decrypt.md) - decrypts a JWE and returns the payload
 - [digest](docs/digest.md) - computes a SHA-2 digest of the provided input

### Documentation and Examples

**Pro-tip** Use the `--help` or `-h` flag to get the documentation directly on the command line. 

The detailed documentation of the tools and plenty example application scenarios are available in the [docs](docs/00_INDEX.md) folder. 

### Reporting Bugs, Issues and Missing Features

Please, use [github](https://github.com/phish108/node-jose-tools/issues) for reporting issues and bugs.

If a certain part of the JOSE specifications is not supported by `node-jose`, then these parts are also unsupported by this tool and **not** considered a bug.

### License

This code is released under a MIT License. Please refer to the [LICENSE file](LICENSE) for more details. 
