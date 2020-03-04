## decrypt

decrypts a JWE token and returns the payload.

SYNOPSIS:

```
> jose decrypt -j KEYSTORE [PAYLOADFILE]
```

One can pass a payload via ```STDIN``` to ```decrypt``` (e.g., the output of ```encrypt```).

The following parameters are accepted.

 * ```-j, --jwks, --keystore KEYSTORE``` - the ```KEYSTORE``` file that contains the private keys for decryption.

 * ```--crit CLAIM[=VALUE]``` - verifies the presence of the header ```CLAIM```. If the optional ```VALUE``` is provided, then the ```CLAIM``` must match the provided ```VALUE```. This option does not accept wildcards.

 * ```--xcrit CLAIM[=VALUE]```  - verifies that the header ```CLAIM``` is not present in the header (x = exclude). If the optional ```VALUE``` is provided, then the ```CLAIM``` must not match the provided ```VALUE``` but is otherwise accepted. This option does not accept wildcards.

 If both, ```--crit``` and ```--xcrit``` are used with the same option, then ```--crit``` overrides ```--xcrit```.

 If more than one ```--crit``` or ```--xcrit``` option provide different values for the same ```crit``` member, then the values count as alternatives (OR). If an option of a ```crit``` member is presented without values, then this overrides all options with values for the same ```crit``` member.
