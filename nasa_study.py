from flask import Flask
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
import json
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

class Mission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    eva_number = db.Column(db.Integer)
    country = db.Column(db.String(255))
    crew = db.Column(db.String(255))
    vehicle = db.Column(db.String(255))
    date = db.Column(db.String(255))
    duration = db.Column(db.String(255))
    purpose = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'eva_number': self.eva_number,
            'country': self.country,
            'crew': self.crew,
            'vehicle': self.vehicle,
            'date': self.date,
            'duration': self.duration,
            'purpose': self.purpose
        }

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'nasaData')
COLLECTION_NAME = 'missions'

@app.route('/')
def home():
    return render_template('missions.html')
@app.route('/about')
def about():
    return render_template('about.html')
@app.route('/videos')
def videos():
    return  render_template('videos.html')

@app.route("/nasaData/missions")
def nasa_missions():
    """
    A Flask view to serve the project data
    from PostgreSQL in JSON format.
    """
    missions = db.session.query(Mission).all()
    missions_json = [mission.to_dict() for mission in missions]
    return json.dumps(missions_json)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
