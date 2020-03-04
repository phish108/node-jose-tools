## digest

computes a SHA-2 digest (aka hash or checksum) of the provided input.

SYNOPSIS:

```
> jose digest [-s SIZE] [DATA]
```

The SHA-digest is returned as a base64url-encoded string.

The tool accepts the following sizes

- 256
- 384
- 512

as well as the corresponding SHA-labels.

If no data is provided or DATA equals `--`, then the data is read from `STDIN`.