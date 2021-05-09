@echo off
docker build -t fyp-objdetweb:latest .
docker run -dp 80:80 -w /FYP -v "D:\FYP\archive\docker-volume":/FYP/uploads fyp-objdetweb