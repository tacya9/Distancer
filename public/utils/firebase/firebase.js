import {FIREBASE_ID_SET, LS_ACTIVE_NAME, LS_PROP, Participant} from "../constants.js";
import {getSettingFromLS, setItemToLS} from "../helpers.js";
import {globalParticipantObj} from "../../components/participants/participants.js";
import {sendDataToFirebase} from "../../components/participants/utils.js";

export const getDistancerIdRef = (distancerId) => `${FIREBASE_ID_SET}/${distancerId}`;
export const getParticipantRef = (distancerId, participantName) => `${FIREBASE_ID_SET}/${distancerId}/participant/${participantName}`;
export const getIsParticipantActiveRef = (distancerId, participantName) => `${FIREBASE_ID_SET}/${distancerId}/participant/${participantName}/isActive`;
export const getLastUpdateRef = (distancerId) => `${FIREBASE_ID_SET}/${distancerId}/lastUpdate`;

const firebaseConfig = {
    apiKey: "AIzaSyClTP8GkjmYRYv0vdARiWh6Gmdt2Ue_BZQ",
    authDomain: "distancer-4b3cf.firebaseapp.com",
    projectId: "distancer-4b3cf",
    storageBucket: "distancer-4b3cf.firebasestorage.app",
    messagingSenderId: "341906421047",
    appId: "1:341906421047:web:5f8260f1bfd4e2870f16b2",
    databaseURL: "https://distancer-4b3cf-default-rtdb.europe-west1.firebasedatabase.app",
    measurementId: "G-PE0K93QP5Y"
};

let lastPosTimestamp = 0;
let app;
export let firebaseDB;

try {
    app = firebase.initializeApp(firebaseConfig);
    firebaseDB = firebase.database(app);
} catch (e) {
    console.error("Ошибка инициализации Firebase:", e);
}

export function processMyData(callback) {
    if ("geolocation" in navigator) {
        const watchPosId = navigator.geolocation.watchPosition(
            position => {
                if (position.timestamp - lastPosTimestamp < +getSettingFromLS(LS_PROP.UPDATE_INTERVAL)) return;

                const distancerId = getSettingFromLS(LS_PROP.DISTANCER_ID);
                const participantName = getSettingFromLS(LS_PROP.PARTICIPANT_NAME);

                if (!distancerId || !participantName) {
                    console.log('distancerId or participantName are not defined in the local storage');
                    setItemToLS(LS_ACTIVE_NAME, false);
                    return;
                }

                const { latitude, longitude, speed, altitude, accuracy } = position.coords;
                const dataToSend = new Participant({
                    isActive: true,
                    icon: getSettingFromLS(LS_PROP.PARTICIPANT_ICON),
                    color: getSettingFromLS(LS_PROP.PARTICIPANT_COLOR),
                    current: {
                        latitude: +latitude.toFixed(6),
                        longitude: +longitude.toFixed(6),
                        speed: speed !== null ? +speed.toFixed(2) : 0,
                        altitude: altitude !== null ? +altitude.toFixed(2) : 0,
                        accuracy: +accuracy.toFixed(2),
                        timestamp: position.timestamp
                    },
                    prev: globalParticipantObj.participant && globalParticipantObj.participant[participantName] ? globalParticipantObj.participant[participantName].current : {}
                });

                lastPosTimestamp = position.timestamp;

                sendDataToFirebase(getParticipantRef(distancerId, participantName), dataToSend, callback);
            },
            error => {
                console.error("Ошибка при получении геопозиции:", error.message);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: +getSettingFromLS(LS_PROP.UPDATE_INTERVAL)
            }
        );
        const intervalId = setInterval(() => {
            callback();
        }, +getSettingFromLS(LS_PROP.UPDATE_INTERVAL));

        return {
            watchPosId,
            intervalId
        }
    } else {
        alert("Геолокация не поддерживается этим браузером.");
    }
}

export function fetchData(callback) {
    const distancerId = getSettingFromLS(LS_PROP.DISTANCER_ID);

    if (firebaseDB) {
        firebaseDB.ref(getDistancerIdRef(distancerId)).get().then(snapshot => {
            if (snapshot.exists()) {
                const distancer = snapshot.val();

                globalParticipantObj.lastUpdate = distancer.lastUpdate;
                globalParticipantObj.participant = distancer.participant;

                callback(distancer);
            } else {
                console.log("fetchData: No data available");
            }
        });
    } else {
        console.warn('Firebase Realtime Database не инициализирован для получения данных.');
    }
}
