@echo off
echo "docker: building..."
docker build -t fyp-objdetweb:latest .
echo "docker: running..."
docker run -dp 80:80 -w /FYP -v "%CD%":/FYP/ fyp-objdetweb