import {getParticipantInfos, getSortedParticipants} from "./utils.js";
import {fetchData, processMyData} from "../../utils/firebase/firebase.js";

export const globalParticipantObj = {};

export default class Participants {
    constructor() {
        this.watchPosId = null;
        this.intervalId = null;
        this.element = this.createParticipants();
    }

    createParticipants() {
        const ul = document.createElement('ul');

        // setInterval(() => {
        //     if (getIsActiveFromLS()) sendMyData(() => fetchData(this.update.bind(this)));
        // }, UPDATE_INTERVAL);

        return ul;
    }
    // start() {
    //     this.watchPositionId = processMyData(this.update.bind(this));
    // }
    // stop() {
    //     navigator.geolocation.clearWatch(this.watchPositionId);
    //     this.element.innerHTML = '';
    // }
    run(isActive) {
        if (isActive) {
            const processId = processMyData(() => fetchData(this.update.bind(this)));

            this.watchPosId = processId.watchPosId;
            this.intervalId = processId.intervalId;
        } else {
            navigator.geolocation.clearWatch(this.watchPosId);
            clearInterval(this.intervalId);
            this.element.innerHTML = '';
        }
    }
    update(distancer1) { // distancer - object from the Realtime DB
        const distancer = {
            "lastUpdate": 1749394588001,
            "participant": {
                "Н": {
                    "current": {
                        "accuracy": 2.71,
                        "altitude": 277.8,
                        "latitude": 53.889499,
                        "longitude": 27.412999,
                        "speed": 28.91,
                        "timestamp": 1749394588001
                    },
                    "icon": "",
                    "name": "",
                    "prev": {
                        "accuracy": 2.26,
                        "altitude": 277.8,
                        "latitude": 53.888229,
                        "longitude": 27.413662,
                        "speed": 28.82,
                        "timestamp": 1749394583001
                    }
                },
                "Ц": {
                    "current": {
                        "accuracy": 3.8,
                        "altitude": 262.69,
                        "latitude": 53.888972,
                        "longitude": 27.41326,
                        "speed": 28.86,
                        "timestamp": 1749394585668
                    },
                    "icon": "",
                    "name": "",
                    "prev": {
                        "accuracy": 3.8,
                        "altitude": 267.67,
                        "latitude": 53.887479,
                        "longitude": 27.414009,
                        "speed": 29.38,
                        "timestamp": 1749394579670
                    }
                }
            }
        }

        const participants = getSortedParticipants(distancer);
        const participantInfos = getParticipantInfos(participants);

        console.log('==============================');
        console.log('distancer:::', distancer);
        console.log('participants:::', participants);
        console.log('participantInfos:::', participantInfos);

        this.element.innerHTML = '';

        participantInfos.forEach(participant => {
            const li = document.createElement('li');
            const distanceDiv = document.createElement('div');
            const participantDiv = document.createElement('div');

            distanceDiv.innerText = `${participant.minDistance} < ${participant.distance} < ${participant.maxDistance}`;
            participantDiv.innerHTML = `${participant.icon} - ${participant.name} - 
acc:${participant.accuracy} - speed:${participant.speed} - alt:${participant.altitude} - time:${new Date(participant.timestamp).toLocaleTimeString()} -
coords: <input readonly value="${participant.latitude}, ${participant.longitude}" />`;
            li.appendChild(distanceDiv);
            li.appendChild(participantDiv);
            this.element.appendChild(li);
        })

        const consoleLogLi = document.createElement('li');
        consoleLogLi.innerText = ' const distancer = ' + JSON.stringify(distancer);
        consoleLogLi.innerText += ' const participants =  ' + JSON.stringify(participants);
        consoleLogLi.innerText += ' const participantInfos = ' + JSON.stringify(participantInfos);

        navigator.clipboard.writeText(consoleLogLi.innerText) // Копируем в буфер
            .then(() => consoleLogLi.innerText = " Текст скопирован в буфер! " + consoleLogLi.innerText)
            .catch(err => {
                consoleLogLi.innerText = " Ошибка копирования в буфер! " + consoleLogLi.innerText;
                console.error(" Ошибка копирования в буфер!", err)
            });

        this.element.appendChild(consoleLogLi);
    }
    render(parent) {
        return parent ? parent.appendChild(this.element) : this.element;
    }
}
