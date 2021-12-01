from app.models.enums.station import Station

class Parser:
    def __init__(self, data):
        self.data = data

    def getDataByStation(self, station):
        airDataForStation = {"timeSet": [], "level": [], "airType": [], "invalid": []}
        for d in self.data:
            if int(d.station) == station:
                airDataForStation["timeSet"].append(d.timeset)
                airDataForStation["level"].append(d.level)
                airDataForStation["airType"].append(int(d.airType))
                airDataForStation["invalid"].append(d.isInvalid)
        return airDataForStation

    def getDataByStationAndPolluter(self, station, polluter):
        airDataForStation = {"timeSet": [], "level": [], "invalid": []}
        for d in self.data:
            if int(d.station) == station and int(d.airType) == polluter:
                airDataForStation["timeSet"].append(d.timeset)
                airDataForStation["level"].append(d.level)
                airDataForStation["invalid"].append(d.isInvalid)
        return airDataForStation

    def getDataByStationAndLevel(self, station, levelStart, levelEnd):
        airDataForStation = {"timeSet": [], "level": [], "invalid": []}
        for d in self.data:
            if int(d.station) == station and levelStart <= levelEnd and levelStart <= float(d.level) and float(d.level) <= levelEnd:
                airDataForStation["timeSet"].append(d.timeset)
                airDataForStation["level"].append(d.level)
                airDataForStation["invalid"].append(d.isInvalid)
        return airDataForStation

    def getDataByTimeSet(self, start, end):
        airDataForStation = {"station": [], "timeSet": [], "level": [], "airType": [], "invalid": []}
        for d in self.data:
            if start <= end and start <= d.timeset and d.timeset <= end:
                airDataForStation["station"].append(int(d.station))
                airDataForStation["timeSet"].append(d.timeset)
                airDataForStation["level"].append(d.level)
                airDataForStation["airType"].append(int(d.airType))
                airDataForStation["invalid"].append(d.isInvalid)
        return airDataForStation

    def getDataByStationAndTimeSet(self, station, start, end):
        airDataForStation = {"timeSet": [], "level": [], "airType": [], "invalid": []}
        for d in self.data:
            if int(d.station) == station and start <= end and start <= d.timeset and d.timeset <= end:
                airDataForStation["timeSet"].append(d.timeset)
                airDataForStation["level"].append(d.level)
                airDataForStation["airType"].append(int(d.airType))
                airDataForStation["invalid"].append(d.isInvalid)
        return airDataForStation
