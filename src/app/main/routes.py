from flask import current_app as app, g, session, render_template, redirect, url_for, Blueprint, json, request
import os, random
from datetime import datetime
from app.parser.parser import *
from app.storage.dataStorage import *

main = Blueprint("main", __name__)

@main.route("/", methods=["GET", "POST"])
def index():
    if request.method=="POST":
        return redirect(url_for(request.form.get("type")))

    return render_template("index.html")

@main.route("/range", methods=["POST", "GET"])
def charts_range():
    if request.method=="POST":
        pars = Parser(DataStorage().getAirData())
        rqst = json.loads(request.get_data())
        data = pars.getDataByStationAndPolluter(int(rqst.get("station")), int(rqst.get("airType")))

        response = app.response_class(
            response=json.dumps(data),
            status=200,
            mimetype="application/json"
        )
        return response 

    return render_template("charts-range.html")

@main.route("/day", methods=["POST", "GET"])
def charts_day():
    if request.method=="POST":
        pars = Parser(DataStorage().getAirData())
        rqst = json.loads(request.get_data())
        data = pars.getDataByStationAndPolluter(int(rqst.get("station")), int(rqst.get("airType")))
        filtered = {} 
        for i,v in enumerate(data.get('timeSet')):
            x = datetime.strptime(v, "%Y-%m-%d %H:%M:%S")
            d = str(datetime.date(x))
            t = datetime.time(x).strftime('%H:%M:%S')
            if d not in filtered:
                filtered[d] = { 'time': [], 'level': [] }
            filtered[d]['time'].append(t)
            filtered[d]['level'].append(data.get('level')[i])

        response = app.response_class(
            response=json.dumps(filtered),
            status=200,
            mimetype="application/json"
        )
        return response 

    return render_template("charts-day.html")
