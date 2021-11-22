from flask import Flask
import os
from app.storage.dataStorage import DataStorage

# Application factory
def create_app():
    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY="de42fa9807694a272bc16aa52a1f8c8fa1b3fb1921cba6489f782dc476310de8",
    )

    dataStorage = DataStorage()
    dataStorage.getAirData()

    from app.main.routes import main

    app.register_blueprint(main);

    return app
