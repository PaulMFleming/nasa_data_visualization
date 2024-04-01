from flask import Flask
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import json
import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
print("SQLAlchemy Database URL:", app.config['SQLALCHEMY_DATABASE_URI'])
db = SQLAlchemy(app)

class Mission(db.Model):
    __tablename__ = 'nasa_eva'
    id = db.Column(db.Integer, primary_key=True)
    evanumber = db.Column(db.Integer)
    country = db.Column(db.String(255))
    crew = db.Column(db.String(255))
    vehicle = db.Column(db.String(255))
    date = db.Column(db.String(255))
    duration = db.Column(db.String(255))
    purpose = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'eva_number': self.evanumber,
            'country': self.country,
            'crew': self.crew,
            'vehicle': self.vehicle,
            'date': self.date,
            'duration': self.duration,
            'purpose': self.purpose
        }

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
