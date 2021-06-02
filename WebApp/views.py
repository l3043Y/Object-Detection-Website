import json
from WebApp.models import DetImg
from os.path import basename, isfile
import ntpath, os

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
            new_det = DetImg(image_filename = result_json["UUID4hex"],
                            result_text = result_json["resultText"],
                            user_id =current_user.id)
            db.session.add(new_det)
            db.session.commit()
            print('DetImg added: '+result_json["fileName"])

        response = jsonify(result_json)
        return response

    return render_template('home.html')

@views.route('/update/state',methods=['POST', 'GET'])
def update_state():
    json_object = {"auth": False,
                    "user": "global",
                    "detectImg": [] }

    if current_user.is_authenticated:
        # [print(img.image_filename) for img in current_user.det_img]
        # [print(img.to_json()) for img in current_user.det_img]
        json_object["auth"] = True
        json_object["user"] = current_user.to_json()
        detect_img_json = []
        try:
            json_files_path = [path_to_json(img.image_filename) for img in current_user.det_img]
            for json_path in json_files_path:
                if isfile(json_path):
                    with open(json_path,) as json_string:
                        detect_img_json.append(json.loads(json_string.read()))
                else:
                    print(json_path,isfile(json_path))
        except Exception as e:
            print("ERR: ", e.__class__, "occurred.")
        
        json_object["detectImg"] = json.loads(json.dumps(detect_img_json))

    # print( 'updateState: ',str(json.dumps(json_object))[:500])
    return jsonify(json_object)

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

def path_to_json(img_path):
    abs_path = os.getcwd()+'/'+img_path
    head, file_extension = os.path.splitext(abs_path)
    return head + '.json'