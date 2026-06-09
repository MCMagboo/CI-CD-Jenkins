#!/usr/bin/env bash
# scripts/deploy.sh
# Simulated deployment so the pipeline runs end-to-end without real servers.
set -euo pipefail

ENVIRONMENT="${1:-staging}"

echo "Starting deploy to '${ENVIRONMENT}'..."

# In a real pipeline this stage might instead:
#   - rsync/scp the dist/ folder to a server
#   - build & push a Docker image:  docker build -t myapp . && docker push ...
#   - apply Kubernetes manifests:   kubectl apply -f k8s/
#   - run Terraform / Ansible / a cloud CLI (aws, gcloud, az)

echo "Deploy to '${ENVIRONMENT}' completed successfully."
