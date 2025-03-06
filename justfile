default:
  justfile --list

dev-db:
  docker compose -f dev.docker-compose.yml up -d
