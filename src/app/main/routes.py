from flask import current_app as app, g, session, render_template, redirect, url_for, Blueprint, json, request
import os, random
from datetime import timedelta, date
from app.parser.parser import *
from app.storage.dataStorage import *

main = Blueprint("main", __name__)

@main.route("/", methods=["POST", "GET"])
def index():
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

    return render_template("index.html")
