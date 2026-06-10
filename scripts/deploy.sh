#!/usr/bin/env bash
# scripts/deploy.sh
set -euo pipefail

ENVIRONMENT="${1:-staging}"
IMAGE_NAME="cicd-demo-app"
CONTAINER_NAME="cicd-demo-${ENVIRONMENT}"
PORT=3000

echo "Starting deploy to '${ENVIRONMENT}'..."

# Build the Docker image
docker build -t "${IMAGE_NAME}:${ENVIRONMENT}" .

# Stop and remove the existing container if it's running
if docker ps -q --filter "name=${CONTAINER_NAME}" | grep -q .; then
  echo "Stopping existing container '${CONTAINER_NAME}'..."
  docker stop "${CONTAINER_NAME}"
  docker rm "${CONTAINER_NAME}"
fi

# Run the new container
docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -p "${PORT}:3000" \
  "${IMAGE_NAME}:${ENVIRONMENT}"

echo "Deploy to '${ENVIRONMENT}' completed successfully."
echo "App is running at http://localhost:${PORT}"
