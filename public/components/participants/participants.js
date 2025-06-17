import {getParticipantInfos, getSortedParticipants, sendDataToFirebase} from "./utils.js";
import {
    fetchData,
    getIsParticipantActiveRef,
    processMyData
} from "../../utils/firebase/firebase.js";
import {getSettingFromLS, isDarkColor, playAlert} from "../../utils/helpers.js";
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

        ul.classList.add('c-layout__list');

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

        participantInfos.forEach((participant, index) => {
            const li = document.createElement('li');
            const participantDiv = document.createElement('div');
            const timeDiff = +new Date() - participant.timestamp;

            li.classList.add('c-layout__info');

            if (index > 0) {
                const distanceDiv = document.createElement('div');

                distanceDiv.classList.add('c-distance');
                distanceDiv.innerHTML = `
                    <div class="c-distance__title">distance(m)</div>
                    <div class="c-distance__meanings">
                        <div class="c-distance__min">${participant.minDistance}</div>
                        <div class="c-distance__char"><</div>
                        <div class="c-distance__real">${participant.distance}</div>
                        <div class="c-distance__char"><</div>
                        <div class="c-distance__max">${participant.maxDistance}</div>
                    </div>
                `;

                if (participant.distance > participant.maxDistance) {
                    distanceDiv.classList.add('m-danger');

                    if (getSettingFromLS(LS_PROP.NOTIFICATION)) {
                        distanceDiv.classList.add('m-notification');
                    }
                    if (getSettingFromLS(LS_PROP.SOUND)) {
                        playAlert('alert');
                    }
                }

                li.appendChild(distanceDiv);
            }

            participantDiv.classList.add('c-participant');
            participantDiv.innerHTML = `
                <div class="c-participant__icon"><i class="fa-solid fa-${participant.icon}"></i></div>
                <div class="c-participant__name">${participant.name}</div>
                <div class="c-participant__accuracy">±${participant.accuracy}</div>
                <div class="c-participant__speed">${participant.speed}</div>
                <div class="c-participant__altitude">${participant.altitude}</div>
            `;

            if (participant.name !== getSettingFromLS(LS_PROP.PARTICIPANT_NAME) && timeDiff > getSettingFromLS(LS_PROP.EXPIRATION_TIME) * 1000 / 2) {
                participantDiv.classList.add('m-offline');

                if (getSettingFromLS(LS_PROP.SOUND)) {
                    playAlert('notification');
                }
            }
            if (participant.color) {
                participantDiv.style.background = participant.color;

                if (isDarkColor(participant.color)) {
                    participantDiv.classList.add('m-dark-mode');
                }
            }

//             participantDiv.innerHTML = ` -  -
// acc: - speed: - alt: - time:${new Date(participant.timestamp).toLocaleTimeString()} -
// coords: <input readonly value="${participant.latitude}, ${participant.longitude}" />`;

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
