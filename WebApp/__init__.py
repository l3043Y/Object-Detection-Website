from flask import Flask

from base64 import b64encode
from PIL import Image
import io
import asyncio

import sys
sys.path.append('YOLOv5')
import os
import time

from pathlib import Path
from PIL import Image
import base64

import numpy as np
import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random

from YOLOv5.models.experimental import attempt_load
from YOLOv5.utils.datasets import letterbox
from YOLOv5.utils.general import check_img_size, non_max_suppression,scale_coords,set_logging, increment_path
from YOLOv5.utils.plots import plot_one_box
from YOLOv5.utils.torch_utils import select_device, time_synchronized


app = Flask(__name__)

def create_app():
    
    app.config['SECRET KEY'] = 'SOmE SeCRet KEy'
    app.config['UPLOAD_FOLDER'] = 'uploads'
    
    from .views import views

    app.register_blueprint(views,url_prefix='/')
    
    return app
   
class YOLOv5:
    def __init__(self, save_img = False, user_dir = 'YOLOv5_Inferance'):
        # self.half, self.names, self.colors = self.initilize()
        self.save_img = save_img
        self.user_dir = user_dir

    def __del__(self):
        torch.cuda.empty_cache()

    def initilize(self):
        # Initialize
        set_logging()
        device = select_device('')
        half = device.type != 'cpu'  # half precision only supported on CUDA

        # Load model
        model = attempt_load('YOLOv5/YOLOv5_Weight_190_epoches.pt', map_location=device)  # load FP32 model
        stride = int(model.stride.max())  # model stride
        imgsz = check_img_size(640, s=stride)  # check img_size
        if half:
            model.half()

        # Get names and colors
        names = model.module.names if hasattr(model, 'module') else model.names
        colors = [[random.randint(0, 255) for _ in range(3)] for _ in names]

        # Run inference
        if device.type != 'cpu':
            model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters())))  # run once
        
        return model, device, half, names, colors
    
    def preprocessing(self, cv2Img, half, device):
        save_dir = Path(self.user_dir)
        if self.save_img:
            save_dir = Path(increment_path(Path(self.user_path),exist_ok=True))
            save_dir.mkdir(parents=True, exist_ok=True)  # make dir
        
        
        im0s = cv2Img
        assert im0s is not None, 'Im0s is None'
        # Padded resize
        img = letterbox(im0s, 640, stride=32)[0]
        # Convert
        img = img[:, :, ::-1].transpose(2, 0, 1)  # BGR to RGB, to 3x416x416
        img = np.ascontiguousarray(img)
        
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()  # uint8 to fp16/32
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        return im0s, img, save_dir

    def inferance(self, cv2Img, model, device, half, names, colors, imgName):
        t0 = time.time()
        im0s, img, save_dir = self.preprocessing(cv2Img, half, device)
        # Inference
        t1 = time_synchronized()
        pred = model(img, augment=False)[0]

        # Apply NMS
        pred = non_max_suppression(pred, 0.25, 0.45, classes=None, agnostic=False)
        t2 = time_synchronized()

        # Process detections
        result_text = ''
        
        for i, det in enumerate(pred):  # detections per image
        
            s, im0 = '', im0s
            save_path = str(save_dir /imgName)
            s += '%gx%g ' % img.shape[2:]  # print string
            if len(det):
                # Rescale boxes from img_size to im0 size
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                # Print results
                for c in det[:, -1].unique():
                    n = (det[:, -1] == c).sum()  # detections per class
                    s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "  # add to string

                # Write results
                for *xyxy, conf, cls in reversed(det):
                    label = f'{names[int(cls)]} {conf:.2f}'
                    plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=3)

            # Print time (inference + NMS)
            result_text = f'{s}Done. ({t2 - t1:.3f}s)'
            print(result_text)

            if self.save_img:
                if not cv2.imwrite(save_path, im0):
                    raise Exception("Could not write image to: "+str(save_path))

            extension = os.path.splitext(imgName)[1]
            is_sucess , img_encoded = cv2.imencode(extension, im0)
            if is_sucess:
                byte_im = img_encoded.tobytes()
            else:
                print(f'>>Debug: filename={imgName}, exension={extension}')
                raise Exception("Could not cvt to bytes: "+str(save_path))
           
        print(f"Results saved to {save_dir}")
        print(f'Done. ({time.time() - t0:.3f}s)')
        del pred,  im0s, img
        return byte_im, str(result_text)
        
    def YOLOv5API(self, path = None, img_base64 = None):

        if img_base64 == None and path != None:
            try:
                _ = Image.open(path)
            except IOError:
                raise Exception(f'>>> NOT IMAGE FILE: {path}')
            
            fileName = Path(path).name
            img = cv2.imread(path)
                
        elif img_base64 != None and path == None:
            fileName = 'base64.jpg'
            im_bytes = base64.b64decode(img_base64)
            im_arr = np.frombuffer(im_bytes, dtype=np.uint8)  # im_arr is one-dim Numpy array
            img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)
        else:
            raise Exception(f'>>> Incorrect argument path={path}, img_base64={img_base64}')
        
        # with torch.no_grad():
            # byte_im, result_text = self.inferance(img, fileName)
   
        return byte_im, result_text, fileName

