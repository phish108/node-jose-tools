## thumbprint

generate the thumbprint for a key

SYNOPSIS

```
jose thumbprint [-s SHASIZE | --sha SHASIZE] [-U --update [-b --beautify -p --private]] [-k|--key] [JWKSTRING]
```

Prints the thumbprint for the provided ```JWKSTRING``` and ```SHASIZE```.

If no key is provided, then ```thumbprint``` reads the key from ```STDIN```.

The ```SHASIZE``` can be either ```1```, ```256```, ```384```, or ```512```. Default ```SHASIZE``` is 256.

If ```-U``` or ```--update``` is present, then the tool will update the key id
to the new thumbprint and return the updated key. In this case the ```-b```
or ```--beautify``` option will beautify the key for readability, and the tool
accepts the ```-p``` or ```--private``` option. If this option is not present,
then the key will only contain the public components. In order to get all key
components of the initial key passing ```-p``` or ```--private``` is
useful. This option has no effect if the initial key was a public key.
