import {Participant} from "../../utils/constants.js";

export function getSortedParticipants(distancer) {
    const participantObj = distancer.participant;
        //  создать тестовые данные с расстояниями между С-50-B-100-A и скоростью 100км/ч с разными timestamp
        //            A.c
        //            A.p
        //            |
        //            B.c
        //            B.p
        //            |
        //            С.c
        //            С.p
    // const participantObj = {
    //     "ввв:Dima": {
    //         "current": { // 54.704148, 25.254298
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // 27.78 m/s = 100 km/h
    //             "latitude": 54.704148,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386995000   // Fri May 16 2025 12:16:35 GMT+0300 (Moscow Standard Time)
    //         },
    //         "icon": "car",
    //         "prev": { // 54.702899, 25.254298
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // fix
    //             "latitude": 54.702899,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386990000   // Fri May 16 2025 12:16:30 GMT+0300 (Moscow Standard Time)
    //         }
    //     },
    //     "_A:Владик": {
    //         "current": { // 54.705048, 25.254298 - 100 метров на север от B.c
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // fix
    //             "latitude": 54.705048,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386997000   // Fri May 16 2025 12:16:37 GMT+0300 (Moscow Standard Time)
    //         },
    //         "icon": "rocket",
    //         "prev": { // 54.703799, 25.254298
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // fix
    //             "latitude": 54.703799,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386992000   // Fri May 16 2025 12:16:32 GMT+0300 (Moscow Standard Time)
    //         }
    //     },
    //     "C:Виталик Белый": {
    //         "current": { // 54.703698, 25.254298 - 50 метров на юг от B.c
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // fix
    //             "latitude": 54.703698,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386996000   // Fri May 16 2025 12:16:36 GMT+0300 (Moscow Standard Time)
    //         },
    //         "icon": "rocket",
    //         "prev": { // 54.702449, 25.254298
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // fix
    //             "latitude": 54.702449,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386991000   // Fri May 16 2025 12:16:31 GMT+0300 (Moscow Standard Time)
    //         }
    //     }
    // }

    // the same position for all participants
    // const participantObj = {
    //     "ввв:Dima": {
    //         "current": { // 54.704548, 25.254298
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // 27.78 m/s = 100 km/h
    //             "latitude": 54.704548,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386995000   // Fri May 16 2025 12:16:35 GMT+0300 (Moscow Standard Time)
    //         },
    //         "icon": "car",
    //         "prev": { // 54.703298, 25.254298
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // fix
    //             "latitude": 54.703298,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386990000   // Fri May 16 2025 12:16:30 GMT+0300 (Moscow Standard Time)
    //         }
    //     },
    //     "_A:Владик": {
    //         "current": { // 54.705048, 25.254298
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // fix
    //             "latitude": 54.705048,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386997000   // Fri May 16 2025 12:16:37 GMT+0300 (Moscow Standard Time)
    //         },
    //         "icon": "rocket",
    //         "prev": { // 54.703798, 25.254298
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // fix
    //             "latitude": 54.703798,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386992000   // Fri May 16 2025 12:16:32 GMT+0300 (Moscow Standard Time)
    //         }
    //     },
    //     "C:Виталик Белый": {
    //         "current": { // 54.704798, 25.254298
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // fix
    //             "latitude": 54.704798,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386996000   // Fri May 16 2025 12:16:36 GMT+0300 (Moscow Standard Time)
    //         },
    //         "icon": "rocket",
    //         "prev": { // 54.703548, 25.254298
    //             "accuracy": 73651.73,
    //             "speed": 27.78,              // fix
    //             "latitude": 54.703548,       // fix
    //             "longitude": 25.254298,      // fix
    //             "timestamp": 1747386991000   // Fri May 16 2025 12:16:31 GMT+0300 (Moscow Standard Time)
    //         }
    //     }
    // }

    // console.log('participantObj', JSON.stringify(participantObj));
    let syncTimestamp = 0;
    const participants = Object.keys(participantObj).map(key => {
        if (participantObj[key].current?.timestamp > syncTimestamp) syncTimestamp = participantObj[key].current.timestamp;

        return new Participant({
            name: key,
            icon: participantObj[key].icon,
            distToHead: 0,
            distance: null,
            current: participantObj[key].current,
            prev: participantObj[key].prev,
            sync: {
                latitude: null,
                longitude: null,
                speed: participantObj[key].current.speed,
                altitude: participantObj[key].current.altitude,
                accuracy: participantObj[key].current.accuracy,
                timestamp: 0,
            }
        })
    });
    participants.sort((a, b) => a.name.localeCompare(b.name));
    participants.forEach(participant => {
        const predictCoordinates = getPredictCoordinates({
            prevTimeMs: participant.prev.timestamp,
            prevCoords: {
                latitude: participant.prev.latitude,
                longitude: participant.prev.longitude
            },
            currTimeMs: participant.current.timestamp,
            currCoords: {
                latitude: participant.current.latitude,
                longitude: participant.current.longitude
            },
            futureTimeMs: syncTimestamp
        });

        participant.sync.timestamp = syncTimestamp;
        participant.sync.latitude = +predictCoordinates.latitude.toFixed(6);
        participant.sync.longitude = +predictCoordinates.longitude.toFixed(6);
    })


    const head = participants[0];
    const slaves = participants.slice(1);

    slaves.forEach(slave => {
        const headCoord = {
            latitude: head.sync.latitude,
            longitude: head.sync.longitude
        };
        const slaveCoord = {
            latitude: slave.sync.latitude,
            longitude: slave.sync.longitude
        };

        slave.distToHead = getDistance(headCoord, slaveCoord);
    })
    slaves.sort((a, b) => a.distToHead - b.distToHead);

    return [head, ...slaves];
}

export function getParticipantInfos(participants) {
    console.log('participants', participants);

    return participants.map((participant, index) => {
        const calcDistance = index > 0 ? participant.distToHead - participants[index - 1].distToHead : undefined;

        return {
            distance: calcDistance >= 0 ? calcDistance : '---',
            minDistance: getSafeDistance(participant.current?.speed),
            maxDistance: getMaxDistance(participant.current?.speed),
            icon: participant.icon,
            name: participant.name,
            accuracy: participant.current?.accuracy,
            speed: participant.current?.speed >= 0 ? Math.round(participant.current.speed * 3.6) : '---',
            altitude: participant.current?.altitude,
            timestamp: participant.current?.timestamp,
            latitude: participant.current?.latitude,
            longitude: participant.current?.longitude,
        }
    })
}

function getSafeDistance(speedMps) {
    if (speedMps >= 0) {
        // Коэффициент: безопасная дистанция ≈ 2 секунды хода
        const REACTION_TIME = 2; // секунды

        // Расстояние = скорость × время реакции
        return Math.round(speedMps * REACTION_TIME);
    }

    return '---';
}

function getMaxDistance(speedMps) {
    if (speedMps >= 0) {
        const RATIO = 2; // секунды
        const MIN_DISTANCE = 20;
        const distance = getSafeDistance(speedMps) * RATIO;

        return distance > MIN_DISTANCE ? distance : MIN_DISTANCE;
    }

    return '---';
}

function getDistance(coord1, coord2) {
    const R = 6371000; // радиус Земли в метрах

    const toRad = deg => deg * Math.PI / 180;

    const lat1 = toRad(coord1.latitude);
    const lon1 = toRad(coord1.longitude);
    const lat2 = toRad(coord2.latitude);
    const lon2 = toRad(coord2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
}

function getPredictCoordinates({prevTimeMs, prevCoords, currTimeMs, currCoords, futureTimeMs}) {
    const EARTH_RADIUS = 6371000; // радиус Земли в метрах

    // Перевод в радианы
    const toRad = deg => deg * Math.PI / 180;
    const toDeg = rad => rad * 180 / Math.PI;

    const lat1 = toRad(prevCoords.latitude);
    const lon1 = toRad(prevCoords.longitude);
    const lat2 = toRad(currCoords.latitude);
    const lon2 = toRad(currCoords.longitude);

    // Временная разница (в секундах)
    const timeDiffSec = (currTimeMs - prevTimeMs) / 1000;

    if (timeDiffSec === 0) {
        return currCoords; // нет движения
    }

    // Расстояние по гаверсинусу
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = EARTH_RADIUS * c;

    // Направление движения (азимут)
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = Math.atan2(y, x); // в радианах

    // Скорость (м/с)
    const speed = distance / timeDiffSec;

    // Сколько секунд в будущее
    const futureDiffSec = (futureTimeMs - currTimeMs) / 1000;

    // Пройденное расстояние в будущее
    const distanceFuture = speed * futureDiffSec;

    // Расчёт новых координат
    const angularDistance = distanceFuture / EARTH_RADIUS;

    const lat3 = Math.asin(
        Math.sin(lat2) * Math.cos(angularDistance) +
        Math.cos(lat2) * Math.sin(angularDistance) * Math.cos(bearing)
    );

    const lon3 = lon2 + Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat2),
        Math.cos(angularDistance) - Math.sin(lat2) * Math.sin(lat3)
    );

    return {
        latitude: toDeg(lat3),
        longitude: toDeg(lon3)
    };
}
