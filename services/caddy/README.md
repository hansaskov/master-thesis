From project root folder:
```bash
docker network create proxy_network
```

```bash
docker compose -f .\services\caddy\compose.yaml --env-file .\services\caddy\.env.caddy up
```

```bash
docker compose -f .\services\caddy\compose.yaml --env-file .\services\caddy\.env.caddy down
```