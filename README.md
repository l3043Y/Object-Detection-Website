## [Object Detection Website](https://github.com/l3043Y/Object-Detection-Website)
Object detection is a computer-vision tasks that make many complex applications involving perception of the surrouding environment archivable. This object detection website is an experiment aimming at developing a website which can upload images and detect the objects on the pictures.
* **Object detection module:** [ultralytics/yolov5](https://github.com/ultralytics/yolov5)
* **Docker Image:** [l3043y/fyp-objdetweb](https://hub.docker.com/repository/registry-1.docker.io/l3043y/fyp-objdetweb/)
* **Dataset:** Objects found in SUSTech Campus and a scrap of COCO dataset ([Kaggle](https://www.kaggle.com/boreycheng/sustech-symbol-scrap-of-coco-dataset)).


## Running the Project
#### Option 1. Docker compose (Recommmanded)
```
docker pull l3043y/fyp-objdetweb:latest
git clone https://github.com/l3043Y/Object-Detection-Website.git
cd Object-Detection-Website
docker-compose up -d
```
#### Option 2. Build docker image from the docker file and spawn containers
```
git clone https://github.com/l3043Y/Object-Detection-Website.git
cd Object-Detection-Website
docker build -t fyp-objdetweb:latest .
docker run -dp 80:80 -w /FYP -v "%CD%\uploads":/FYP/uploads fyp-objdetweb
```
#### Option 3. Python development environment 
Anaconda virtual environment is recommended to install packages.


**Install [PyTorch](https://pytorch.org/get-started/locally/#start-locally)**
```
pip install -r requirements.txt
git clone https://github.com/l3043Y/Object-Detection-Website.git
cd Object-Detection-Website
python main.py
```
