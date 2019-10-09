from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/test')
def test():
    users = [{'name': 'lukas', 'email': "x@y.cz"}, {'name': 'tom', 'email': "z@f.cz"}]
    return jsonify({"users": users})


@app.route('/login', methods=['POST'])
def login():
    username = request.get_json()['username']
    password = request.get_json()['password']
    # db check if username and pass are ok

    res = {
        "username": username,
        "password": password
    }
    return jsonify({"result": res})


@app.route('/register', methods=['POST'])
def register():
    username = request.get_json()['username']
    password = request.get_json()['password']
    # db check if username exists
    # save to DB, hash password
    res = {
        "username": username,
        "password": password
    }
    return jsonify({"result": res})


if __name__ == '__main__':
    app.run()
