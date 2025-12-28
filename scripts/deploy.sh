#!/bin/bash

# E-Commerce Platform Kubernetes Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
NAMESPACE="ecommerce"

echo "🚀 Deploying E-Commerce Platform to Kubernetes"
echo "Environment: $ENVIRONMENT"
echo "Namespace: $NAMESPACE"
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if namespace exists, create if not
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
    echo "📦 Creating namespace: $NAMESPACE"
    kubectl apply -f k8s/namespace.yaml
else
    echo "✅ Namespace $NAMESPACE already exists"
fi

# Apply ConfigMap
echo "📝 Applying ConfigMap..."
kubectl apply -f k8s/configmap.yaml

# Check if secrets exist
if ! kubectl get secret ecommerce-secrets -n $NAMESPACE &> /dev/null; then
    echo "⚠️  Warning: ecommerce-secrets not found!"
    echo "Please create secrets first:"
    echo "kubectl create secret generic ecommerce-secrets \\"
    echo "  --from-literal=MONGODB_URI='your-mongodb-uri' \\"
    echo "  --from-literal=JWT_SECRET='your-jwt-secret' \\"
    echo "  --namespace=$NAMESPACE"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if image pull secret exists
if ! kubectl get secret ghcr-secret -n $NAMESPACE &> /dev/null; then
    echo "⚠️  Warning: ghcr-secret not found!"
    echo "Please create image pull secret first:"
    echo "kubectl create secret docker-registry ghcr-secret \\"
    echo "  --docker-server=ghcr.io \\"
    echo "  --docker-username=YOUR_GITHUB_USERNAME \\"
    echo "  --docker-password=YOUR_GITHUB_TOKEN \\"
    echo "  --namespace=$NAMESPACE"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Deploy Backend
echo "🔧 Deploying Backend..."
kubectl apply -f k8s/backend-deployment.yaml

# Wait for backend to be ready
echo "⏳ Waiting for backend pods to be ready..."
kubectl wait --for=condition=ready pod -l component=backend -n $NAMESPACE --timeout=300s || true

# Deploy Frontend
echo "🎨 Deploying Frontend..."
kubectl apply -f k8s/frontend-deployment.yaml

# Wait for frontend to be ready
echo "⏳ Waiting for frontend pods to be ready..."
kubectl wait --for=condition=ready pod -l component=frontend -n $NAMESPACE --timeout=300s || true

# Deploy Ingress
echo "🌐 Deploying Ingress..."
kubectl apply -f k8s/ingress.yaml

# Deploy HPA (optional)
if [ -f k8s/hpa.yaml ]; then
    echo "📊 Deploying HorizontalPodAutoscaler..."
    kubectl apply -f k8s/hpa.yaml
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Deployment Status:"
kubectl get all -n $NAMESPACE

echo ""
echo "🔍 Ingress Status:"
kubectl get ingress -n $NAMESPACE

echo ""
echo "📝 Next steps:"
echo "1. Check pod logs: kubectl logs -n $NAMESPACE -l app=ecommerce"
echo "2. Get LoadBalancer IP: kubectl get ingress -n $NAMESPACE"
echo "3. Update DNS to point to LoadBalancer IP"
echo "4. Test endpoints:"
echo "   - Frontend: https://your-domain.com"
echo "   - Backend: https://api.your-domain.com/api/health"
echo ""
echo "🎉 Happy deploying!"
