## verify

verifies a signed JWS token and returns the payload

SYNOPSIS:

```
> jose verify -j KEYSTORE -i ISSUER -a AUDIENCE [--alg ALLOWEDALGORITHM] [--noalg FORBIDDENALGORITHM]
```

One can pass a payload via ```STDIN``` to the ```verify``` tool (e.g., the output of ```sign```).

The following parameters are accepted.

 * ```-a, --aud AUDIENCE``` - the target of the JWS that will verify the token

 * ```-i, --issuer ISSUER``` - the issuer of the JWS

 * ```-j, --jwks, --keystore KEYSTORE``` - the ```KEYSTORE``` file that contains the singing keys.

 * ```-K, --key JWK``` - pass a ```JWK``` formatted key directly. This will ignore any provided keystore.

 * ```--alg ALLOWEDALGORITHM``` - allow a signing algorithm. This is typically used in combination with ```--noalg``` options. It is possible to use the ```node-jose``` algorithm wildcards. To allow multiple algorithms, use this option multiple times.

 * ```--noalg FORBIDDENALGORITHM``` - forbid a signing algorithm. It is possible to use the ```node-jose``` algorithm wildcards. To forbid multiple algorithms, use this option multiple times.

 * ```--crit CLAIM[=VALUE]``` - verifies the presence of the header ```CLAIM```. If the optional ```VALUE``` is provided, then the ```CLAIM``` must match the provided ```VALUE```. This option does not accept wildcards.

 * ```--xcrit CLAIM[=VALUE]```  - verifies that the header ```CLAIM``` is not present in the header (x = exclude). If the optional ```VALUE``` is provided, then the ```CLAIM``` must not match the provided ```VALUE``` but is otherwise accepted. This option does not accept wildcards.

 If both, ```--crit``` and ```--xcrit``` are used with the same option, then ```--crit``` overrides ```--xcrit```.

 If more than one ```--crit``` or ```--xcrit``` option provide different values for the same ```crit``` member, then the values count as alternatives (OR). If an option of a ```crit``` member is presented without values, then this overrides all options with values for the same ```crit``` member.
