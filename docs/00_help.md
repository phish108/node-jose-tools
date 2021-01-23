**Missing Toolname**

Use one of the tool names.

- addkey - add a new key to a JWKS
- newkey - create a new JWK key
- listkeys - list the key ids for all keys in a JWKS
- findkey - find a kid in a JWKS
- rmkey - remove a kid from a JWKS
- thumbprint - generate the thumbprint for a key
- info - return basic information about a JWT without processing it
- digest - runs a selected hashing algorithm on the provided data.
- sign - creates and signs a JWS for a given payload
- verify - verifies a JWS and return the payload
- encrypt - encrypt a payload into a JWE
- decrypt - decrypts a JWE and returns the payload

For more details run  

```
jose TOOLNAME --help
```