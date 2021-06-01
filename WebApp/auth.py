from flask import Blueprint, jsonify, request, flash, redirect, url_for
from flask.wrappers import Response
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user


auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    msg = ''
    user_json = 'global'
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        print(request.form)
        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                msg = 'Logged in successfully!'
                login_user(user, remember=True)
                user_json = current_user.to_json()
            else:
                msg = 'Incorrect password, try again.'
        else:
            msg = 'Email does not exist.'
            
    print(msg)
    response = jsonify({"success" : current_user.is_authenticated, 
                        "user" : user_json,
                         "msg" : msg})
    return response
    # return render_template("login.html", user=current_user)

@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    response = jsonify({"success" : True, 
                        "user" : "global",
                         "msg" : 'Logout Successfully'})
    return response


@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    msg = ''
    user_json = 'global'
    if request.method == 'POST':
        print(request.form)
        email = request.form.get('email')
        first_name = request.form.get('firstName')
        password1 = request.form.get('password')
        password2 = request.form.get('password2')
        user = User.query.filter_by(email=email).first()
        if user:
            msg = 'Email already exists.'
        elif len(email) < 4:
            msg = 'Email must be greater than 3 characters.'
        elif len(first_name) < 2:
            msg = 'First name must be greater than 1 character.'
        elif password1 != password2:
            msg = 'Passwords don\'t match.'
        elif len(password1) < 7:
            msg = 'Password must be at least 7 characters.'
        else:
            new_user = User(email=email, first_name=first_name, password=generate_password_hash(
                password1, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            user_json = new_user.to_json()
            msg = 'Account created!'
    print(msg)        
    response = jsonify({"success" : current_user.is_authenticated, 
                        "user" : user_json,
                         "msg" : msg})
    return response
