FROM ultralytics/yolov5

LABEL key="OBJECT DETECTION WEBSITE" 

COPY . /FYP
RUN pip install flask

WORKDIR /FYP
ENTRYPOINT ["python", "main.py", "docker" ]
