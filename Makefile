# =======================================
# Project Makefile for Docker Management
# =======================================
.DEFAULT_GOAL := help

# Docker Compose executable and file
DC := docker compose
DC_FILE := docker-compose.yml

# Service identifiers
SERVICE_FRONT := mubadala-front
SERVICE_BACK  := mubadala-back
SERVICE_DB    := mubadala-db

# =======================================
# Phony targets
# =======================================
.PHONY: all build up up-dev up-prod rebuild-prod down restart logs logs-front logs-back logs-db \
        shell-front shell-back shell-db clean prune help

# ---------------------------------------
# Build all services
# ---------------------------------------
build:
	$(DC) -f $(DC_FILE) build

# ---------------------------------------
# Start services in development mode
# ---------------------------------------
up:
	DEV_MODE=true $(DC) -f $(DC_FILE) up -d

# ---------------------------------------
# Start services in production mode (no rebuild)
# ---------------------------------------
up-prod:
	BUILD_FRONT=false BUILD_BACK=false $(DC) -f $(DC_FILE) up -d

# ---------------------------------------
# Rebuild frontend and backend for production
# ---------------------------------------
rebuild-prod:
	BUILD_FRONT=true BUILD_BACK=true $(DC) -f $(DC_FILE) up -d

# ---------------------------------------
# Stop and remove all containers
# ---------------------------------------
down:
	$(DC) -f $(DC_FILE) down

# ---------------------------------------
# Restart all services
# ---------------------------------------
restart: $(DC) -f $(DC_FILE) restart

# =======================================
# Logs
# =======================================
logs:
	$(DC) -f $(DC_FILE) logs -f

logs-front:
	$(DC) -f $(DC_FILE) logs -f $(SERVICE_FRONT)

logs-back:
	$(DC) -f $(DC_FILE) logs -f $(SERVICE_BACK)

logs-db:
	$(DC) -f $(DC_FILE) logs -f $(SERVICE_DB)

# =======================================
# Shell access
# =======================================
shell-front:
	$(DC) -f $(DC_FILE) exec $(SERVICE_FRONT) /bin/sh

shell-back:
	$(DC) -f $(DC_FILE) exec $(SERVICE_BACK) /bin/sh

shell-db:
	$(DC) -f $(DC_FILE) exec $(SERVICE_DB) /bin/sh

# =======================================
# Cleanup
# =======================================
clean:
	$(DC) -f $(DC_FILE) down -v

prune:
	docker system prune -af --volumes

# =======================================
# Help
# =======================================
help:
	@echo "Docker Makefile for mubadala project"
	@echo ""
	@echo "Commands:"
	@echo "  make build           Build all services"
	@echo "  make up              Start all services in development mode"
	@echo "  make up-prod         Start all services in production mode without rebuild"
	@echo "  make rebuild-prod    Rebuild and start frontend/backend in production mode"
	@echo "  make down            Stop all services and remove containers"
	@echo "  make restart         Restart all services"
	@echo "  make logs            Show logs for all services"
	@echo "  make logs-front      Show logs for frontend service"
	@echo "  make logs-back       Show logs for backend service"
	@echo "  make logs-db         Show logs for database service"
	@echo "  make shell-front     Open shell in frontend container"
	@echo "  make shell-back      Open shell in backend container"
	@echo "  make shell-db        Open shell in database container"
	@echo "  make clean           Remove containers, networks, and volumes"
	@echo "  make prune           Remove unused Docker objects"
