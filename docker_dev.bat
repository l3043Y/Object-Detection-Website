@echo off
rem echo "docker: building..."
rem docker build -t fyp-objdetweb:latest .
echo docker: running...
docker run -dp 80:80 -w /FYP -v "%CD%":/FYP ultralytics/yolov5 sh -c "python main.py docker"