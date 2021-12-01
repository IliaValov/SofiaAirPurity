SET VENV_DIR=venv\Scripts
IF NOT EXIST %VENV_DIR% (
    python -m venv venv
)
CALL %VENV_DIR%\activate
CALL %VENV_DIR%\pip install -r requirements.txt
SET FLASK_APP=src/app
SET FLASK_ENV=development
START cmd /k flask run --host=0.0.0.0
SLEEP 5
START "" "http://localhost:5000"
