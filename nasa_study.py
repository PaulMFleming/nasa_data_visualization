from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'nasaData'
COLLECTION_NAME = 'missions'


@app.route('/')
def index():
    return render_template("index.html")


if __name__ == '__main__':
    app.run()
