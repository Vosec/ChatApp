import pymysql
from datetime import datetime

MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = ''
MYSQL_DB = 'chatapp'

conn = pymysql.connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB)
cur = conn.cursor()


def check(username):
    """
    Checks if username exists in DB
    :param username: name of user
    :return: returns username, hashed pw, and date of creation
    """
    cur.execute("""SELECT * FROM users where userName = %s""", str(username))
    rv = cur.fetchone()
    return rv


def register(username, password):
    """
    User registration into DB
    :param username: name of user
    :param password: hashed password of user
    :return: None
    """
    created = datetime.utcnow()
    cur.execute("""INSERT INTO users (userName, userPw, created) VALUES (%s, %s, %s)""", (str(username), str(password),
                str(created)))
    conn.commit()

