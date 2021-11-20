from flask import current_app as app, g, session, render_template, redirect, url_for, Blueprint
import os

main = Blueprint("main", __name__)

@main.route("/")
def index():
    return render_template("index.html")
