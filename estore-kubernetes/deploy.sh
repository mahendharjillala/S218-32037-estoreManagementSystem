#!/bin/bash

# Build Docker images
echo "🚀 Building Docker images..."

echo "🔨 Building frontend image..."
docker build -t estore-frontend:latest ../estore-app/frontend -f ../estore-app/frontend/dockerfile

echo "🔨 Building backend image..."
docker build -t estore-backend:latest ../estore-app/backend

# Deploy to Kubernetes
echo "🚀 Deploying to Kubernetes..."

echo "📦 Deploying backend..."
kubectl apply -f kubernetes/backend-deployment.yaml

echo "🖥️  Deploying frontend..."
kubectl apply -f kubernetes/frontend-deployment.yaml

echo "🌐 Setting up Ingress..."
kubectl apply -f kubernetes/ingress.yaml

# Wait for pods to be ready
echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=estore --timeout=120s

# Get the Minikube IP if using Minikube
if command -v minikube &> /dev/null; then
  MINIKUBE_IP=$(minikube ip)
  echo ""
  echo "✅ Deployment Complete!"
  echo ""
  echo "🌍 Access the application using:"
  echo "- Frontend (NodePort): http://$MINIKUBE_IP:30000"
  echo "- Backend API: http://$MINIKUBE_IP:30000/api"
  echo "- H2 Console: http://$MINIKUBE_IP:30000/h2-console"
  echo ""
  echo "🔗 For Ingress access, add to your /etc/hosts:"
  echo "$MINIKUBE_IP estore.local"
  echo "Then access: http://estore.local"
  echo ""
  echo "🔍 Check pod status with: kubectl get pods"
else
  echo ""
  echo "✅ Deployment Complete!"
  echo ""
  echo "🔍 Check pod status with: kubectl get pods"
  echo ""
  echo "🌍 Access the application:"
  echo "- Frontend service is exposed on NodePort 30000"
  echo "- H2 Console is available at: /h2-console"
fi

echo ""
echo "🚀 All done!"
