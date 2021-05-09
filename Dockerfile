FROM ultralytics/yolov5

COPY . /fyp
RUN pip install flask


WORKDIR /fyp
CMD python /fyp/main.py