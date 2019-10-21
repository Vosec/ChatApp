from flask import Flask, request, jsonify
import pymysql
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)

app = Flask(__name__)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = ''
MYSQL_DB = 'chatapp'
app.config['JWT_SECRET_KEY'] = 'secret'

conn = pymysql.connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB)

# Home page router in frontend
# @app.route('/')
# def home():
#     return render_template("index.html")


@app.route('/login', methods=['POST'])
def login():
    username = request.get_json()['username']
    password = request.get_json()['password']

    cur = conn.cursor()
    cur.execute("SELECT * FROM users where userName = '" + str(username) + "'")
    rv = cur.fetchone()
    if rv is None:
        return jsonify({"error": "Invalid username and password"}), 401
    if bcrypt.check_password_hash(rv[1], password):
        access_token = create_access_token(
            identity={'username': rv[0], 'password': rv[1]})
        return access_token
    else:
        return jsonify({"error": "Invalid username and password"}), 401


@app.route('/register', methods=['POST'])
def register():
    cur = conn.cursor()
    created = datetime.utcnow()

    username = request.get_json()['username']
    password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')

    cur.execute("SELECT * FROM users where userName = '" + str(username) + "'")
    rv = cur.fetchone()

    if rv is not None:
        return jsonify({"error": "Username already exists"}), 409

    cur.execute("INSERT INTO users (userName, userPw, created) VALUES ('" +
                str(username) + "', '" +
                str(password) + "', '" +
                str(created) + "')")
    conn.commit()

    # FIXME: What should I return?
    # result = {
    #     'username': username,
    #     'password': password,
    #     'created': created
    # }
    # return jsonify({'result': result})
    return jsonify({"result": "ok"})


if __name__ == '__main__':
    app.run()
