# Docker Build & Test Guide

## Local Docker Build and Test

### Build Images Locally

```bash
# Build backend image
docker build -f Dockerfile.backend -t ecommerce-backend:local .

# Build frontend image
docker build -f Dockerfile.frontend -t ecommerce-frontend:local .
```

### Test Images Locally

#### Test Backend

```bash
# Run backend container
docker run -d \
  --name ecommerce-backend-test \
  -p 5000:5000 \
  -e MONGODB_URI="mongodb://host.docker.internal:27017/ecommerce" \
  -e JWT_SECRET="test-secret-key-min-32-characters-long" \
  -e PORT=5000 \
  -e NODE_ENV=development \
  ecommerce-backend:local

# Check logs
docker logs -f ecommerce-backend-test

# Test health endpoint
curl http://localhost:5000/api/health

# Stop and remove
docker stop ecommerce-backend-test
docker rm ecommerce-backend-test
```

#### Test Frontend

```bash
# Run frontend container
docker run -d \
  --name ecommerce-frontend-test \
  -p 8080:80 \
  ecommerce-frontend:local

# Check logs
docker logs -f ecommerce-frontend-test

# Test in browser
open http://localhost:8080

# Stop and remove
docker stop ecommerce-frontend-test
docker rm ecommerce-frontend-test
```

### Test with Docker Compose

Create `docker-compose.test.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: ecommerce
    volumes:
      - mongo-data:/data/db

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/ecommerce
      - JWT_SECRET=test-secret-key-min-32-characters-long
      - PORT=5000
      - NODE_ENV=development
    depends_on:
      - mongodb

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "8080:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

Run with Docker Compose:

```bash
# Start all services
docker-compose -f docker-compose.test.yml up -d

# View logs
docker-compose -f docker-compose.test.yml logs -f

# Seed database
docker-compose -f docker-compose.test.yml exec backend node server/seed.js

# Stop all services
docker-compose -f docker-compose.test.yml down
```

## GitHub Actions Workflow

The workflow automatically:

1. **Triggers on**:
   - Push to `main` or `develop` branches
   - Pull requests to `main`
   - Tags starting with `v*` (e.g., v1.0.0)
   - Manual workflow dispatch

2. **Builds**:
   - Backend image (Node.js)
   - Frontend image (Nginx)
   - Multi-architecture (amd64, arm64)

3. **Tags images with**:
   - Branch name (e.g., `main`, `develop`)
   - Commit SHA (e.g., `main-abc1234`)
   - Semantic version (e.g., `v1.0.0`, `1.0`, `1`)
   - `latest` (for main branch only)

4. **Pushes to**:
   - GitHub Container Registry (ghcr.io)

5. **Security**:
   - Runs Trivy vulnerability scanner
   - Uploads results to GitHub Security

## Image Naming Convention

```
ghcr.io/OWNER/REPO-backend:TAG
ghcr.io/OWNER/REPO-frontend:TAG
```

Examples:
```
ghcr.io/afnersirait/ecommerce-platform-backend:latest
ghcr.io/afnersirait/ecommerce-platform-backend:main
ghcr.io/afnersirait/ecommerce-platform-backend:v1.0.0
ghcr.io/afnersirait/ecommerce-platform-frontend:latest
```

## Manual Workflow Trigger

1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Build and Push Docker Images"
4. Click "Run workflow"
5. Select branch
6. Click "Run workflow"

## Viewing Built Images

### On GitHub

1. Go to repository
2. Click "Packages" on the right sidebar
3. View all published images

### Pull Images

```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull images
docker pull ghcr.io/afnersirait/ecommerce-platform-backend:latest
docker pull ghcr.io/afnersirait/ecommerce-platform-frontend:latest
```

## Image Optimization

### Backend Image
- Uses Node.js 18 Alpine (smaller base)
- Multi-stage build (if needed)
- Only production dependencies
- Health check included

### Frontend Image
- Multi-stage build (Node.js → Nginx)
- Static files served by Nginx
- Gzip compression enabled
- Security headers configured
- Health check endpoint

## Image Sizes

Approximate sizes:
- Backend: ~200-300 MB
- Frontend: ~50-100 MB

## Troubleshooting

### Build fails in GitHub Actions

1. Check workflow logs in Actions tab
2. Verify Dockerfile syntax
3. Check for missing dependencies
4. Ensure all files are committed

### Image pull fails in Kubernetes

1. Verify GHCR credentials
2. Check image name and tag
3. Ensure imagePullSecret is configured
4. Verify image exists in GHCR

### Container won't start

1. Check container logs: `docker logs CONTAINER_ID`
2. Verify environment variables
3. Check health check endpoint
4. Test locally first

## Best Practices

1. **Always test locally before pushing**
2. **Use semantic versioning for releases**
3. **Keep images small** (use Alpine, multi-stage builds)
4. **Include health checks**
5. **Scan for vulnerabilities regularly**
6. **Use specific tags in production** (not `latest`)
7. **Document environment variables**
8. **Keep secrets out of images**

## CI/CD Pipeline Flow

```
Code Push → GitHub Actions → Build Images → Push to GHCR → Deploy to K8s
     ↓            ↓              ↓              ↓              ↓
  Commit      Checkout       Docker Build    Tag & Push    Pull & Deploy
              Code           Multi-arch      Scan Security  Rolling Update
```

## Security Scanning

Trivy scans for:
- OS vulnerabilities
- Application dependencies
- Misconfigurations
- Secrets in images

View results in:
- GitHub Security tab
- Actions workflow logs

## Cleanup Old Images

GitHub automatically keeps:
- Tagged images indefinitely
- Untagged images for 14 days

Manual cleanup:
1. Go to Packages
2. Select package
3. Delete old versions

---

**Ready to build?** Push to main branch to trigger the workflow!
