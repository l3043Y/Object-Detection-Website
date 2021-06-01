import json
from WebApp.models import DetImg
from os.path import basename
from pathlib import Path
from flask import Blueprint, render_template, request, jsonify
from flask.helpers import make_response
from werkzeug.utils import secure_filename
from flask_login import login_user, login_required, logout_user, current_user
from WebApp import YOLOv5
from . import app
views = Blueprint('views',__name__)

from base64 import b64encode
import sys
sys.path.append('YOLOv5')
from pathlib import Path

import cv2
import torch

from . import db

save_dir = Path(f'{app.config["UPLOAD_FOLDER"]}')

@views.route('/',methods=['POST', 'GET'])
def home():
    if request.method == 'POST':
        packet = request.files['img_file']
        filename = secure_filename(packet.filename)
        
        save_dir.mkdir(parents=True,exist_ok=True)
        
        save_path = str(save_dir / filename )
        packet.save(save_path)
                
        result_json = detect(save_path)

        if(current_user.is_authenticated):
            new_det = DetImg(image_filename = result_json["fileName"],
                            result_text = result_json["resultText"],
                            user_id =current_user.id)
            db.session.add(new_det)
            db.session.commit()
            print('DetImg added: '+result_json["fileName"])

        response = jsonify(result_json)
        return response

    return render_template('home.html')

@views.route('/update/state',methods=['POST'])
def update_state():
    [print(img.id) for img in current_user.det_img]
    return jsonify({"Auth": current_user.is_authenticated,
                    "userName": current_user.first_name})

print("Initialize... model")
Path(f'{app.config["UPLOAD_FOLDER"]}')
yolo = YOLOv5(save_img = True, user_dir = str(save_dir / 'detect' ))
model, device, half, names, colors = yolo.initilize()

def detect(save_path):
    cv2Img = cv2.imread(save_path)
    # img_bytes, result_text, _ = YOLOv5API(path=save_path,save_img=False,save_path=str(save_dir))
    with torch.no_grad():
        result_json= yolo.inferance(cv2Img, model, device, half, names, colors, imgName = basename(save_path))


    return result_json
