# Release Guide

## Creating a New Release

The Docker image build pipeline is triggered **only when you create a new release** on GitHub.

## How to Create a Release

### Option 1: Via GitHub Web Interface (Recommended)

1. **Go to your repository on GitHub**
   - Navigate to: `https://github.com/afnersirait/ecommerce-platform`

2. **Click on "Releases"**
   - On the right sidebar, click "Releases"
   - Or go directly to: `https://github.com/afnersirait/ecommerce-platform/releases`

3. **Click "Draft a new release"**

4. **Choose or create a tag**
   - Click "Choose a tag"
   - Type a new tag name (e.g., `v1.0.0`, `v1.1.0`, `v2.0.0`)
   - Click "Create new tag: v1.0.0 on publish"

5. **Fill in release details**
   - **Release title**: e.g., "Version 1.0.0 - Initial Release"
   - **Description**: Add release notes, changelog, features, bug fixes, etc.

   Example:
   ```markdown
   ## What's New in v1.0.0
   
   ### Features
   - ✨ Complete e-commerce platform
   - 🛒 Shopping cart functionality
   - 💳 Stripe payment integration
   - 📦 Order management
   - 👤 User authentication
   - 🎨 Modern responsive UI
   
   ### Technical
   - Docker images for Kubernetes deployment
   - Auto-scaling configuration
   - Security scanning with Trivy
   
   ### Installation
   See [KUBERNETES_DEPLOYMENT.md](KUBERNETES_DEPLOYMENT.md) for deployment instructions.
   ```

6. **Set as latest release** (optional)
   - Check "Set as the latest release" if this is your newest version

7. **Publish release**
   - Click "Publish release"

8. **GitHub Actions will automatically trigger**
   - Go to "Actions" tab to watch the build
   - Images will be built and pushed to GHCR

### Option 2: Via GitHub CLI

```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh
# Login: gh auth login

# Create a release
gh release create v1.0.0 \
  --title "Version 1.0.0 - Initial Release" \
  --notes "First production release with all core features"

# Or create from a file
gh release create v1.0.0 \
  --title "Version 1.0.0" \
  --notes-file CHANGELOG.md
```

### Option 3: Via Git Tags + GitHub

```bash
# 1. Create and push a tag
git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"
git push origin v1.0.0

# 2. Go to GitHub and convert the tag to a release
# - Navigate to the tag on GitHub
# - Click "Create release from tag"
# - Fill in details and publish
```

## Semantic Versioning

Follow [Semantic Versioning](https://semver.org/) (SemVer):

```
MAJOR.MINOR.PATCH (e.g., v1.2.3)
```

- **MAJOR** (v2.0.0): Breaking changes, incompatible API changes
- **MINOR** (v1.1.0): New features, backwards compatible
- **PATCH** (v1.0.1): Bug fixes, backwards compatible

### Examples

```bash
# Initial release
v1.0.0

# Bug fix
v1.0.1

# New feature
v1.1.0

# Breaking change
v2.0.0

# Pre-release versions (optional)
v1.0.0-alpha
v1.0.0-beta
v1.0.0-rc1
```

## What Happens After Release

### 1. GitHub Actions Triggers

The workflow automatically:
- Checks out the code
- Builds Docker images for backend and frontend
- Tags images with multiple versions
- Pushes to GitHub Container Registry
- Runs security scans

### 2. Image Tags Created

For release `v1.2.3`, the following tags are created:

```
ghcr.io/afnersirait/ecommerce-platform-backend:v1.2.3
ghcr.io/afnersirait/ecommerce-platform-backend:1.2
ghcr.io/afnersirait/ecommerce-platform-backend:1
ghcr.io/afnersirait/ecommerce-platform-backend:latest
ghcr.io/afnersirait/ecommerce-platform-backend:sha-abc1234

ghcr.io/afnersirait/ecommerce-platform-frontend:v1.2.3
ghcr.io/afnersirait/ecommerce-platform-frontend:1.2
ghcr.io/afnersirait/ecommerce-platform-frontend:1
ghcr.io/afnersirait/ecommerce-platform-frontend:latest
ghcr.io/afnersirait/ecommerce-platform-frontend:sha-abc1234
```

### 3. Deploy to Kubernetes

After images are built, deploy to Kubernetes:

```bash
# Update to use the new version
kubectl set image deployment/ecommerce-backend \
  backend=ghcr.io/afnersirait/ecommerce-platform-backend:v1.2.3 \
  -n ecommerce

kubectl set image deployment/ecommerce-frontend \
  frontend=ghcr.io/afnersirait/ecommerce-platform-frontend:v1.2.3 \
  -n ecommerce

# Or use latest
kubectl rollout restart deployment/ecommerce-backend -n ecommerce
kubectl rollout restart deployment/ecommerce-frontend -n ecommerce
```

## Manual Workflow Trigger

You can also manually trigger the workflow without creating a release:

1. Go to "Actions" tab on GitHub
2. Select "Build and Push Docker Images"
3. Click "Run workflow"
4. Select branch
5. Click "Run workflow"

This is useful for testing or emergency builds.

## Viewing Releases

### On GitHub
- Go to: `https://github.com/afnersirait/ecommerce-platform/releases`
- See all releases with their tags, dates, and notes

### Via GitHub CLI
```bash
# List all releases
gh release list

# View specific release
gh release view v1.0.0

# Download release assets
gh release download v1.0.0
```

## Viewing Built Images

### On GitHub Packages
1. Go to your repository
2. Click "Packages" on the right sidebar
3. View all published images with their tags

### Pull Images
```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull specific version
docker pull ghcr.io/afnersirait/ecommerce-platform-backend:v1.0.0
docker pull ghcr.io/afnersirait/ecommerce-platform-frontend:v1.0.0

# Pull latest
docker pull ghcr.io/afnersirait/ecommerce-platform-backend:latest
docker pull ghcr.io/afnersirait/ecommerce-platform-frontend:latest
```

## Release Checklist

Before creating a release:

- [ ] All tests passing
- [ ] Code reviewed and merged to main
- [ ] CHANGELOG.md updated
- [ ] Version number decided (following SemVer)
- [ ] Documentation updated
- [ ] Database migrations prepared (if any)
- [ ] Environment variables documented
- [ ] Breaking changes noted

After creating a release:

- [ ] Verify GitHub Actions workflow completed successfully
- [ ] Check images are available in GHCR
- [ ] Review security scan results
- [ ] Test images locally (optional)
- [ ] Deploy to staging environment
- [ ] Deploy to production
- [ ] Monitor application health
- [ ] Announce release to team/users

## Rollback a Release

If you need to rollback:

### 1. Rollback in Kubernetes
```bash
# Rollback to previous version
kubectl rollout undo deployment/ecommerce-backend -n ecommerce
kubectl rollout undo deployment/ecommerce-frontend -n ecommerce

# Or rollback to specific version
kubectl set image deployment/ecommerce-backend \
  backend=ghcr.io/afnersirait/ecommerce-platform-backend:v1.0.0 \
  -n ecommerce
```

### 2. Delete Bad Release (optional)
```bash
# Via GitHub CLI
gh release delete v1.0.1 --yes

# Via GitHub web interface
# Go to the release and click "Delete"
```

## Best Practices

1. **Always test before releasing**
   - Test in development environment
   - Run all tests
   - Review changes

2. **Write good release notes**
   - List new features
   - Document breaking changes
   - Include upgrade instructions
   - Link to documentation

3. **Use semantic versioning**
   - Makes it clear what changed
   - Helps users understand impact
   - Enables automated tooling

4. **Tag releases properly**
   - Always use `v` prefix (e.g., `v1.0.0`)
   - Use annotated tags: `git tag -a v1.0.0 -m "message"`
   - Push tags: `git push origin v1.0.0`

5. **Keep a CHANGELOG**
   - Document all changes
   - Follow [Keep a Changelog](https://keepachangelog.com/)
   - Update before each release

6. **Automate what you can**
   - Use GitHub Actions for builds
   - Automate testing
   - Automate deployments (with approval gates)

## Example Release Workflow

```bash
# 1. Finish your features and merge to main
git checkout main
git pull origin main

# 2. Update version in package.json (optional)
# Edit package.json and client/package.json

# 3. Update CHANGELOG.md
# Add your changes under a new version heading

# 4. Commit version bump
git add .
git commit -m "chore: bump version to 1.1.0"
git push origin main

# 5. Create release on GitHub
# Go to GitHub → Releases → Draft new release
# Or use CLI:
gh release create v1.1.0 \
  --title "Version 1.1.0 - New Features" \
  --notes-file CHANGELOG.md

# 6. Wait for GitHub Actions to complete
# Check Actions tab

# 7. Deploy to Kubernetes
./scripts/deploy.sh

# 8. Verify deployment
kubectl get pods -n ecommerce
curl https://your-domain.com/api/health
```

## Troubleshooting

### Workflow doesn't trigger
- Ensure release is "published" not "draft"
- Check workflow file syntax
- Verify GitHub Actions is enabled

### Build fails
- Check Actions logs for errors
- Verify Dockerfile syntax
- Ensure all dependencies are available
- Check for missing files

### Images not appearing in GHCR
- Verify GITHUB_TOKEN has correct permissions
- Check if workflow completed successfully
- Ensure package visibility is correct

### Can't pull images
- Login to GHCR first
- Verify image name and tag
- Check package permissions
- Ensure imagePullSecret is configured in K8s

---

**Ready to release?** Follow the steps above to create your first release!
