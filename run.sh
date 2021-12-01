if [ ! -d "venv" ]; then
    if [ $(command -v python) ]; then
        python -m venv venv
    elif [ $(command -v python3) ]; then
        python3 -m venv venv
    fi
fi
. venv/bin/activate
venv/bin/python3 -m pip install -r requirements.txt
export FLASK_APP=src/app
export FLASK_ENV=development
flask run --host 0.0.0.0 &
link="http://localhost:5000"
sleep 5s
if grep -qEi "(Microsoft|WSL)" /proc/version &> /dev/null; then
    explorer.exe "$link"
else
    xdg-open "$link"
fi
