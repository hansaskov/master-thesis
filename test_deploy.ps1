# 1. Start caddy in it's own proxy network. 
docker compose --profile proxy -p proxy up -d

## `--profile proxy`     Will only start the caddy service.
## `-p proxy`            Will use the `proxy` network.
## `-d`                  Will run the service in the background.

# 2. Start the stateless and stateful services in production mode
docker compose -f compose.yaml --profile stateful --profile stateless --profile migrate  up --build  -d

## `-f .\compose.yaml`   Will use the production compose file without the `compose.override.yaml`. This step makes sure it does not turn into a development environment. 
## `--profile stateful`  Will start the backend and frontend.
## `--profile stateless` Will start timescaledb.
## `--build`             Will build the images before starting the containers.
## `-d`                  Will run the services in the background.

# 3. Set enviroment variables for the preview deployment
$env:COMPOSE_PROJECT_NAME="thesis-preview"
$env:INTERFACE_FQDN="http://preview.localhost"

# 4. Start the preview deployment. The same way as in step 2.
docker compose -f .\compose.yaml --profile stateful --profile stateless  up --build  -d

# 5. Clean up the environment variables
Remove-Item Env:COMPOSE_PROJECT_NAME
Remove-Item Env:INTERFACE_FQDN

