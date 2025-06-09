import {FIREBASE_ID_SET, LS_ACTIVE_NAME, LS_PROP, LS_SETTINGS_NAME} from "./constants.js";
import {firebaseDB, getDistancerIdRef, getParticipantRef} from "./firebase/firebase.js";

function getItemFromLS(itemName) {
    return JSON.parse(localStorage.getItem(itemName));
}

export function setItemToLS(itemName, value) {
    localStorage.setItem(itemName, JSON.stringify(value));
    updateViewFromLS();
}

export function updateViewFromLS() {
    const lsIsActive = getIsActiveFromLS();
    const lsSettings = getItemFromLS(LS_SETTINGS_NAME);
    const runButton = document.getElementById('runButton');
    const distancerIdSpan = document.getElementById('distancerId');
    const participantNameSpan = document.getElementById('participantName');

    runButton.innerText = lsIsActive ? 'stop' : 'start';

    if (lsSettings) Object.keys(lsSettings).forEach(key => {
        switch (key) {
            case LS_PROP.DISTANCER_ID:
                distancerIdSpan.innerText = lsSettings[key];
                break;
            case LS_PROP.PARTICIPANT_NAME:
                participantNameSpan.innerText = lsSettings[key];
                break;
        }
    })
}

export function getIsActiveFromLS() {
    const lsIsActive = getItemFromLS(LS_ACTIVE_NAME);

    return !!lsIsActive;
}

export function getSettingFromLS(propName) {
    const lsSettings = getItemFromLS(LS_SETTINGS_NAME);

    return lsSettings ? lsSettings[propName] : null;
}

export function setIsActiveToLS(value) {
    setItemToLS(LS_ACTIVE_NAME, value);
}

export function setSettingsToLS(newSettings) {
    const oldDistancerId = getSettingFromLS(LS_PROP.DISTANCER_ID);
    const oldParticipantName = getSettingFromLS(LS_PROP.PARTICIPANT_NAME);

    if (oldDistancerId === newSettings[LS_PROP.DISTANCER_ID] && oldParticipantName !== newSettings[LS_PROP.PARTICIPANT_NAME]) {
        firebaseDB.ref(getParticipantRef(oldDistancerId, oldParticipantName)).remove()
            .then((e) => {
                console.log('The old participant name has been removed successfully!', e);
            }).catch((e) => {
                console.log('The old participant name has not been removed');
            });
    }

    setItemToLS(LS_SETTINGS_NAME, newSettings);
}

export function clearOutdatedIds() {
    const INTERVAL_TO_CLEAR = 1800000; // 1800000ms - 30min

    setInterval(() => {
        firebaseDB.ref(FIREBASE_ID_SET).get().then(snapshot => {
            if (snapshot.exists()) {
                const now = +new Date();
                const idSet = snapshot.val();
                const idsToRemove = Object.keys(idSet).filter(key => (now - idSet[key].lastUpdate) > INTERVAL_TO_CLEAR);

                idsToRemove.forEach(idToRemove => {
                    firebaseDB.ref(getDistancerIdRef(idToRemove)).remove().then(() => {
                        console.log(`The distancer "${idToRemove}" has been cleaned`);
                    });
                })
            } else {
                console.log("FIREBASE_ID_SET: No data available to clear");
            }
        });
    }, INTERVAL_TO_CLEAR);
}
