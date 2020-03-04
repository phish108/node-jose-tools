## rmkey

removes a key with the provided key id from the provided key store and returns it

SYNOPSIS

```
> jose rmkey KEYID [-j KEYSTORE] [-U --update -q --quiet -b --beautify]
```

The tool ```rmkey``` allows to remove multiple keys in one got. In this case each key id must
be provided in a separate line of the ```KEYID```-string. If no ```KEYID``` is provided, ```rmkey``` tries to load the ```KEYID``` from the command line. Alternatively, ONE key id can be passed using the ```-k``` or ```--kid``` option.   

 * ```-j, --jwks, --keystore KEYSTORE``` - loads the given key store from the ```KEYSTORE``` file. If this parameter is missing ```rmkey``` tries to load a key store from ```STDIN```. If that fails, then ```rmkey``` fails with an error

 * ```-k, --kid KEYID``` - the key id in the key store to be used in this operation.

 * ```-q, --quiet``` - generates no output. This flag omits the output of the key store.

 * ```-U, --update``` - updates the provided key store if ```-j, --jwks```, or ```--keystore``` is present.

 * ```-b, --beautify``` - pretty print JSON

By default ```rmkey``` returns the updated key store on ```STDOUT```. If ```-j, --jwks``` or ```--keystore``` is provided, then the ```-U``` flag will overwrite the provided key store.

Make sure that you make a copy of your original key store if you use the ```-U``` flag.
