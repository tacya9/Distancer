import {FIREBASE_ID_SET, LS_ACTIVE_NAME, LS_PROP, Participant, UPDATE_INTERVAL} from "../constants.js";
import {getSettingFromLS, setItemToLS} from "../helpers.js";
import {globalParticipantObj} from "../../components/participants/participants.js";

export const getDistancerIdRef = (distancerId) => `${FIREBASE_ID_SET}/${distancerId}`;
export const getParticipantRef = (distancerId, participantName) => `${FIREBASE_ID_SET}/${distancerId}/participant/${participantName}`;
export const getLastUpdateRef = (distancerId) => `${FIREBASE_ID_SET}/${distancerId}/lastUpdate`;

const firebaseConfig = {
    apiKey: "AIzaSyCSw34wRh8vuWk34JC4rmJau_I5yB9ey08",
    authDomain: "distancer-draft.firebaseapp.com",
    projectId: "distancer-draft",
    storageBucket: "distancer-draft.firebasestorage.app",
    messagingSenderId: "644445501550",
    appId: "1:644445501550:web:d7c25e407faf4635404e7f",
    databaseURL: "https://distancer-draft-default-rtdb.europe-west1.firebasedatabase.app"
};

let lastPosTimestamp = 0;
let app;
export let firebaseDB;
// let isFetchingLocation = false;

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
                if (position.timestamp - lastPosTimestamp < UPDATE_INTERVAL) return;

                const distancerId = getSettingFromLS(LS_PROP.DISTANCER_ID);
                const participantName = getSettingFromLS(LS_PROP.PARTICIPANT_NAME);

                if (!distancerId || !participantName) {
                    console.log('distancerId or participantName are not defined in the local storage');
                    setItemToLS(LS_ACTIVE_NAME, false);
                    return;
                }

                const { latitude, longitude, speed, altitude, accuracy } = position.coords;
                const dataToSend = new Participant({
                    icon: getSettingFromLS(LS_PROP.PARTICIPANT_ICON),
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

                if (firebaseDB) {
                    firebaseDB.ref(getParticipantRef(distancerId, participantName)).set(dataToSend)
                        .then(() => {
                            console.log('Данные GPS отправлены:', dataToSend);
                            firebaseDB.ref(getLastUpdateRef(distancerId)).set(dataToSend.current.timestamp);
                        })
                        .catch(error => console.error('Ошибка отправки данных:', error))
                        .finally(callback);
                } else {
                    console.warn('Firebase Realtime Database не инициализирован.');
                }
            },
            error => {
                console.error("Ошибка при получении геопозиции:", error.message);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: UPDATE_INTERVAL
            }
        );
        const intervalId = setInterval(() => {
            // const now = +new Date();
            //
            // if (now - lastPosTimestamp > UPDATE_INTERVAL) callback();

            callback();
        }, UPDATE_INTERVAL);

        return {
            watchPosId,
            intervalId
        }
    } else {
        alert("Геолокация не поддерживается этим браузером.");
    }
}

// export function sendMyData(callback) {
//     const distancerId = getSettingFromLS(LS_PROP.DISTANCER_ID);
//     const participantName = getSettingFromLS(LS_PROP.PARTICIPANT_NAME);
//
//     if (!distancerId || !participantName) {
//         console.log('distancerId or participantName are not defined in the local storage');
//         return;
//     }
//     if (isFetchingLocation) {
//         console.log('Предыдущий запрос геолокации еще не завершен.');
//         return;
//     }
//
//     console.log('sendMyData -----------------------------------------------');
//     if (navigator.geolocation) {
//         isFetchingLocation = true;
//
//         navigator.geolocation.getCurrentPosition(
//             position => {
//                 isFetchingLocation = false;
//
//                 const { latitude, longitude, speed, altitude, accuracy } = position.coords;
//                 const dataToSend = new Participant({
//                     icon: getSettingFromLS(LS_PROP.PARTICIPANT_ICON),
//                     current: {
//                         latitude: +latitude.toFixed(6),
//                         longitude: +longitude.toFixed(6),
//                         speed: speed !== null ? +speed.toFixed(2) : 0,
//                         altitude: altitude !== null ? +altitude.toFixed(2) : 0,
//                         accuracy: +accuracy.toFixed(2),
//                         timestamp: position.timestamp
//                     },
//                     prev: globalParticipantObj.participant ? globalParticipantObj.participant[participantName].current : {}
//                 });
//
//                 if (firebaseDB) {
//                     firebaseDB.ref(getParticipantRef(distancerId, participantName)).set(dataToSend)
//                         .then(() => {
//                             console.log('Данные GPS отправлены:', dataToSend);
//                             firebaseDB.ref(getLastUpdateRef(distancerId)).set(dataToSend.current.timestamp);
//                         })
//                         .catch(error => console.error('Ошибка отправки данных:', error))
//                         .finally(callback);
//                 } else {
//                     console.warn('Firebase Realtime Database не инициализирован.');
//                 }
//             },
//             error => {
//                 isFetchingLocation = false;
//                 console.error('Ошибка получения GPS:', error);
//             },
//             {
//                 enableHighAccuracy: true, // Попробуйте включить высокую точность
//                 // timeout: 10000,           // Установите разумный тайм-аут (например, 10 секунд)
//                 maximumAge: 0             // Запрашивать самые свежие данные
//             }
//         );
//     } else {
//         console.error('Geolocation не поддерживается браузером.');
//     }
// }

export function fetchData(callback) {
    console.log('fetchData -----------------------------------------------');
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
        // listenerUnsubscribe = firebaseDB.ref('gps_data').on('value', snapshot => {
        //     const data = snapshot.val();
        //     if (data) {
        //         console.log('Data has been changed:', data);
        //     } else {
        //         console.log('No data');
        //     }
        // });
    } else {
        console.warn('Firebase Realtime Database не инициализирован для получения данных.');
    }
}
