from pathlib import Path
from flask import Blueprint, render_template, request
from flask.helpers import make_response
from werkzeug.utils import secure_filename

from WebApp import YOLOv5
from . import app
views = Blueprint('views',__name__)

from base64 import b64encode
import sys
sys.path.append('YOLOv5')
from pathlib import Path

import cv2
import torch

@views.route('/',methods=['POST', 'GET'])
def home():
    if request.method == 'POST':
        packet = request.files['img_file']
        filename = secure_filename(packet.filename)
        save_dir = Path(f'{app.config["UPLOAD_FOLDER"]}')
        save_dir.mkdir(parents=True,exist_ok=True)
        
        save_path = str(save_dir / filename )
        packet.save(save_path)
                
        b64, result_text = detect(save_path)

        response = {'Status' : 'Success', 'ResultText' : result_text, 'Base64img' : b64}
        
        # with open("base64.txt", "w") as f:
        #     f.write(b64)
        #     f.close()

        r = make_response(response)
        r.mimetype = 'application/json'
        return r

    return render_template('home.html')

print("Initialize model")
yolo = YOLOv5()
model, device, half, names, colors = yolo.initilize()

def detect(save_path):
    cv2Img = cv2.imread(save_path)
    # img_bytes, result_text, _ = YOLOv5API(path=save_path,save_img=False,save_path=str(save_dir))
    with torch.no_grad():
        img_bytes, result_text = yolo.inferance(cv2Img, model, device, half, names, colors, imgName='base64.jpg')
    # del yolo

    b64 = b64encode(img_bytes).decode('utf-8')

    return b64, result_text
