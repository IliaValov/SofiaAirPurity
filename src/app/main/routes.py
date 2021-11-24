from flask import current_app as app, g, session, render_template, redirect, url_for, Blueprint, jsonify
import os, random
from datetime import timedelta, date

main = Blueprint("main", __name__)

@main.route("/")
def index():
    return render_template("index.html")

# Just testing requests
@main.route("/data")
def data():
    def daterange(date1, date2):
        for n in range(int ((date2 - date1).days)+1):
            yield date1 + timedelta(n)
    labels = [dt.strftime("%Y-%m-%d") for dt in daterange(date(2013,3,9), date(2016,3,5))][1:50]
    values = [random.randrange(0,100) for x in labels]
    return jsonify({
        "labels": labels,
        "values": values
        })
