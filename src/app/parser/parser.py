from app.models.enums.station import Station

class Parser:
    def __init__(self, data):
        self.data = data

    def getDataByStation(self, station):
        airDataForStation = []
        for d in self.data:
            if int(d.station) == station:
                airDataForStation.append(d)
        return airDataForStation

    def getDataByStationAndPoluter(self, station, polluter):
        airDataForStation = []
        for d in self.data:
            if int(d.station) == station and int(d.airType) == polluter:
                airDataForStation.append(d)
        return airDataForStation

    def getDataByStationAndLever(self, station, levelStart, levelEnd):
        airDataForStation = []
        for d in self.data:
            if int(d.station) == station and levelStart <= levelEnd and levelStart <= float(d.level) and float(d.level) <= levelEnd:
                airDataForStation.append(d)
        return airDataForStation

    def getDataByTimeSet(self, start, end):
        airDataForStation = []
        for d in self.data:
            if start <= end and start <= d.timeset and d.timeset <= end:
                airDataForStation.append(d)
        return airDataForStation

    def getDataByStationAndTimeSet(self, station, start, end):
        airDataForStation = []
        for d in self.data:
            if int(d.station) == station and start <= end and start <= d.timeset and d.timeset <= end:
                airDataForStation.append(d)
        return airDataForStation