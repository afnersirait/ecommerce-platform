# Kubernetes Deployment Guide

This guide covers deploying the E-Commerce Platform to Kubernetes using the Docker images built by GitHub Actions.

## Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Helm (optional, for cert-manager)
- GitHub Container Registry access
- MongoDB (Atlas or in-cluster)
- Domain name with DNS configured

## Architecture

```
┌─────────────────────────────────────────────┐
│              Load Balancer                   │
│         (Ingress Controller)                 │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
   ┌───▼────┐      ┌───▼────┐
   │Frontend│      │Backend │
   │ (Nginx)│      │(Node.js)│
   │  Pods  │      │  Pods  │
   └────────┘      └───┬────┘
                       │
                  ┌────▼────┐
                  │ MongoDB │
                  │ (Atlas) │
                  └─────────┘
```

## Step 1: Setup GitHub Container Registry Access

### Create GitHub Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with `read:packages` scope
3. Save the token securely

### Create Kubernetes Secret for Image Pull

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=YOUR_EMAIL \
  --namespace=ecommerce
```

## Step 2: Configure Secrets

### Create Kubernetes Secrets

```bash
# Create namespace first
kubectl apply -f k8s/namespace.yaml

# Create secrets (replace with your actual values)
kubectl create secret generic ecommerce-secrets \
  --from-literal=MONGODB_URI='mongodb+srv://user:pass@cluster.mongodb.net/ecommerce' \
  --from-literal=JWT_SECRET='your-super-secret-jwt-key-min-32-characters' \
  --from-literal=STRIPE_SECRET_KEY='sk_live_xxxxx' \
  --from-literal=STRIPE_PUBLISHABLE_KEY='pk_live_xxxxx' \
  --from-literal=STRIPE_WEBHOOK_SECRET='whsec_xxxxx' \
  --from-literal=CLOUDINARY_CLOUD_NAME='your_cloud_name' \
  --from-literal=CLOUDINARY_API_KEY='your_api_key' \
  --from-literal=CLOUDINARY_API_SECRET='your_api_secret' \
  --namespace=ecommerce
```

## Step 3: Update ConfigMap

Edit `k8s/configmap.yaml` with your domain:

```yaml
data:
  CLIENT_URL: "https://your-actual-domain.com"
```

Apply the ConfigMap:

```bash
kubectl apply -f k8s/configmap.yaml
```

## Step 4: Deploy Application

### Deploy Backend

```bash
kubectl apply -f k8s/backend-deployment.yaml
```

Verify backend is running:

```bash
kubectl get pods -n ecommerce -l component=backend
kubectl logs -n ecommerce -l component=backend --tail=50
```

### Deploy Frontend

```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

Verify frontend is running:

```bash
kubectl get pods -n ecommerce -l component=frontend
```

## Step 5: Setup Ingress

### Install Nginx Ingress Controller (if not already installed)

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

### Install Cert-Manager for SSL (optional but recommended)

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

Create ClusterIssuer for Let's Encrypt:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### Update and Deploy Ingress

Edit `k8s/ingress.yaml` and replace `your-domain.com` with your actual domain.

```bash
kubectl apply -f k8s/ingress.yaml
```

## Step 6: Enable Auto-Scaling (Optional)

```bash
kubectl apply -f k8s/hpa.yaml
```

Verify HPA:

```bash
kubectl get hpa -n ecommerce
```

## Step 7: Verify Deployment

### Check all resources

```bash
kubectl get all -n ecommerce
```

### Check ingress

```bash
kubectl get ingress -n ecommerce
kubectl describe ingress ecommerce-ingress -n ecommerce
```

### Test endpoints

```bash
# Backend health check
curl https://api.your-domain.com/api/health

# Frontend
curl https://your-domain.com
```

## Monitoring and Logs

### View logs

```bash
# Backend logs
kubectl logs -n ecommerce -l component=backend -f

# Frontend logs
kubectl logs -n ecommerce -l component=frontend -f

# All pods
kubectl logs -n ecommerce --all-containers=true -f
```

### Port forward for debugging

```bash
# Backend
kubectl port-forward -n ecommerce svc/ecommerce-backend 5000:5000

# Frontend
kubectl port-forward -n ecommerce svc/ecommerce-frontend 8080:80
```

## Updating the Application

### Automatic Updates via GitHub Actions

When you push to the `main` branch, GitHub Actions will:
1. Build new Docker images
2. Push to GitHub Container Registry
3. Tag with commit SHA and `latest`

### Manual Update

```bash
# Force pods to pull new images
kubectl rollout restart deployment/ecommerce-backend -n ecommerce
kubectl rollout restart deployment/ecommerce-frontend -n ecommerce

# Check rollout status
kubectl rollout status deployment/ecommerce-backend -n ecommerce
kubectl rollout status deployment/ecommerce-frontend -n ecommerce
```

### Rollback if needed

```bash
kubectl rollout undo deployment/ecommerce-backend -n ecommerce
kubectl rollout undo deployment/ecommerce-frontend -n ecommerce
```

## Scaling

### Manual scaling

```bash
# Scale backend
kubectl scale deployment ecommerce-backend --replicas=5 -n ecommerce

# Scale frontend
kubectl scale deployment ecommerce-frontend --replicas=3 -n ecommerce
```

### Auto-scaling

HPA will automatically scale based on CPU/Memory usage (if configured).

## Database Management

### Seed Database

```bash
# Get a backend pod name
BACKEND_POD=$(kubectl get pods -n ecommerce -l component=backend -o jsonpath='{.items[0].metadata.name}')

# Run seed script
kubectl exec -n ecommerce $BACKEND_POD -- node server/seed.js
```

### Create Admin User

```bash
# Connect to MongoDB and update user role
# This depends on your MongoDB setup (Atlas, in-cluster, etc.)
```

## Troubleshooting

### Pods not starting

```bash
kubectl describe pod POD_NAME -n ecommerce
kubectl logs POD_NAME -n ecommerce
```

### Image pull errors

```bash
# Verify secret exists
kubectl get secret ghcr-secret -n ecommerce

# Recreate if needed
kubectl delete secret ghcr-secret -n ecommerce
# Then create again with correct credentials
```

### Connection issues

```bash
# Check services
kubectl get svc -n ecommerce

# Check endpoints
kubectl get endpoints -n ecommerce

# Test internal connectivity
kubectl run -n ecommerce test-pod --image=curlimages/curl --rm -it -- sh
# Then: curl http://ecommerce-backend:5000/api/health
```

### SSL/TLS issues

```bash
# Check certificate
kubectl get certificate -n ecommerce
kubectl describe certificate ecommerce-tls -n ecommerce

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager
```

## Production Checklist

- [ ] MongoDB connection string configured
- [ ] All secrets created and verified
- [ ] Domain DNS pointing to LoadBalancer IP
- [ ] SSL certificates issued and valid
- [ ] Resource limits configured appropriately
- [ ] HPA enabled and tested
- [ ] Monitoring and logging setup
- [ ] Backup strategy for MongoDB
- [ ] CI/CD pipeline tested
- [ ] Health checks responding correctly
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Security scanning enabled

## Cost Optimization

1. **Use appropriate resource requests/limits**
2. **Enable HPA to scale down during low traffic**
3. **Use spot instances for non-critical workloads**
4. **Configure PodDisruptionBudgets**
5. **Use MongoDB Atlas free tier for development**

## Security Best Practices

1. **Never commit secrets to Git**
2. **Use Kubernetes secrets or external secret managers**
3. **Enable network policies**
4. **Regular security scans (Trivy in CI/CD)**
5. **Keep images updated**
6. **Use non-root containers**
7. **Enable RBAC**
8. **Regular backups**

## Support

For issues:
1. Check pod logs
2. Verify secrets and config
3. Check ingress configuration
4. Review GitHub Actions logs
5. Open an issue on GitHub

---

**Ready to deploy?** Follow the steps above in order!
