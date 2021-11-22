import json
import os 
import pathlib
from app.models.airPoint import AirPoint

class DataStorage:
    def getAirData(self):
        path = pathlib.Path(__file__).parent.resolve()
        
        fileStorage = open(os.path.join(path ,"data.json"), "r")
        data = json.loads(fileStorage.read())
        AirPoints = []
        for airPoint in data:
            if airPoint[0] == 'timest':
                continue;
            
            AirPoints.append(AirPoint(airPoint[0], airPoint[1], airPoint[2], airPoint[3], airPoint[4]))
            
        return AirPoints
        





