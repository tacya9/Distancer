import {getParticipantInfos, getSortedParticipants, sendDataToFirebase} from "./utils.js";
import {
    fetchData,
    getIsParticipantActiveRef,
    processMyData
} from "../../utils/firebase/firebase.js";
import {getSettingFromLS} from "../../utils/helpers.js";
import {LS_PROP} from "../../utils/constants.js";

export const globalParticipantObj = {};

export default class Participants {
    constructor() {
        this.watchPosId = null;
        this.intervalId = null;
        this.element = this.createParticipants();
    }

    createParticipants() {
        const ul = document.createElement('ul');

        return ul;
    }
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
    update(distancer) { // distancer - object from the Realtime DB
        const participants = getSortedParticipants(distancer);
        const participantInfos = getParticipantInfos(participants);

        this.element.innerHTML = '';

        participantInfos.forEach(participant => {
            const li = document.createElement('li');
            const distanceDiv = document.createElement('div');
            const participantDiv = document.createElement('div');
            const timeDiff = +new Date() - participant.timestamp;

            distanceDiv.innerText = `${participant.minDistance} < ${participant.distance} < ${participant.maxDistance}`;
            participantDiv.innerHTML = `${participant.icon} - ${participant.name} - 
acc:${participant.accuracy} - speed:${participant.speed} - alt:${participant.altitude} - time:${new Date(participant.timestamp).toLocaleTimeString()} -
coords: <input readonly value="${participant.latitude}, ${participant.longitude}" />`;

            if (participant.color) li.style.background = participant.color;

            li.appendChild(distanceDiv);
            li.appendChild(participantDiv);

            this.element.appendChild(li);

            if (participant.name !== getSettingFromLS(LS_PROP.PARTICIPANT_NAME) && participant.isActive && timeDiff > getSettingFromLS(LS_PROP.EXPIRATION_TIME) * 1000) {
                this.disableParticipant(participant.name);
            }
        })

        // const consoleLogLi = document.createElement('li');
        // consoleLogLi.innerText = ' const distancer = ' + JSON.stringify(distancer);
        // consoleLogLi.innerText += ' const participants =  ' + JSON.stringify(participants);
        // consoleLogLi.innerText += ' const participantInfos = ' + JSON.stringify(participantInfos);
        //
        // navigator.clipboard.writeText(consoleLogLi.innerText) // Копируем в буфер
        //     .then(() => consoleLogLi.innerText = " Текст скопирован в буфер! " + consoleLogLi.innerText)
        //     .catch(err => {
        //         consoleLogLi.innerText = " Ошибка копирования в буфер! " + consoleLogLi.innerText;
        //         console.error(" Ошибка копирования в буфер!", err)
        //     });
        //
        // this.element.appendChild(consoleLogLi);
    }
    disableParticipant(name) {
        sendDataToFirebase(getIsParticipantActiveRef(getSettingFromLS(LS_PROP.DISTANCER_ID), name), false)
    }
    render(parent) {
        return parent ? parent.appendChild(this.element) : this.element;
    }
}
