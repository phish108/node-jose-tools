## info

prints basic information for compressed JWT without processing it.

SYNOPSIS:

```
> jose info [-b] [JWTFILE]
```

If no ```JWTFILE``` is provided ```info``` will read the JWT from STDIN.

Add the ```-b``` flag to pretty print the result.

This tool provides quick information about a JWT, such as token type
and header claims. For JWS ```info``` also includes the payload claims.

Note that ```info``` does not attempt to validate or decrypt a token.
