import json
from . import db
from flask_login import UserMixin
from flask import jsonify
from sqlalchemy.sql import func


class DetImg(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_filename = db.Column(db.String(100))
    result_text = db.Column(db.String(1000))
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    def to_json(self):
        return {"id" : self.id,
                "image_filename": self.image_filename,
                "result_text": self.result_text,
                "date": self.date,
                "user_id" : self.user_id}


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    det_img = db.relationship('DetImg')

    def to_json(self):
        print(self.det_img)
        json_format = {"id" : self.id,
                "email": self.email,
                "firstName": self.first_name}        
        return json_format
