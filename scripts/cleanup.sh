#!/bin/bash

# E-Commerce Platform Kubernetes Cleanup Script
# Usage: ./scripts/cleanup.sh

set -e

NAMESPACE="ecommerce"

echo "🗑️  Cleaning up E-Commerce Platform from Kubernetes"
echo "Namespace: $NAMESPACE"
echo ""

read -p "Are you sure you want to delete all resources in namespace $NAMESPACE? (yes/no) " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo "Deleting resources..."

# Delete in reverse order
kubectl delete -f k8s/hpa.yaml --ignore-not-found=true
kubectl delete -f k8s/ingress.yaml --ignore-not-found=true
kubectl delete -f k8s/frontend-deployment.yaml --ignore-not-found=true
kubectl delete -f k8s/backend-deployment.yaml --ignore-not-found=true
kubectl delete -f k8s/configmap.yaml --ignore-not-found=true

echo ""
read -p "Do you want to delete secrets too? (yes/no) " -r
echo
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    kubectl delete secret ecommerce-secrets -n $NAMESPACE --ignore-not-found=true
    kubectl delete secret ghcr-secret -n $NAMESPACE --ignore-not-found=true
    echo "✅ Secrets deleted"
fi

echo ""
read -p "Do you want to delete the namespace? (yes/no) " -r
echo
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    kubectl delete namespace $NAMESPACE --ignore-not-found=true
    echo "✅ Namespace deleted"
fi

echo ""
echo "✅ Cleanup complete!"
