FROM ultralytics/yolov5

LABEL key="OBJECT DETECTION WEBSITE" 

COPY . /FYP
RUN pip install -r requirements.txt && pip install Flask-SQLAlchemy && pip install Flask-Login

WORKDIR /FYP
ENTRYPOINT ["python", "main.py", "docker" ]
