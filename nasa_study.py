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
    """
    A Flask view to serve the main page.
    """
    return render_template("index.html")

@app.route("/nasaData/missions")
def nada_missions():
    """
    A Flask view to serve the project data
    from MongoDB in JSON format.
    """

    # A constant that defines the record fields we wish to retrieve.
    FIELDS = {
        '_id' : False, 'EVA#' : True, 'Country' : True,
        'Crew' : True, 'Vehicle' : True, 'Date' : True, 
        'Duration' : True, 'Purpose' : True
    }

    # Open a connection to MongoDB using a with statement
    # connection closes as soon as we exit the with statement
    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
        # Define collection to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve results based on FIELDS and set a limit of results
        projects = collection.find(projection=FIELDS, limit=10000)
        # Convert to JSON and return the JSON data
        return json.dumps(list(projects))


if __name__ == '__main__':
    app.run()
