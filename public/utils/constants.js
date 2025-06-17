export const LS_SETTINGS_NAME = 'distancer.settings';
export const LS_ACTIVE_NAME = 'distancer.isActive'; // 'true' means that app is working and gps data is sending

export const LS_PROP = {
    DISTANCER_ID: 'distancerId',
    PARTICIPANT_ICON: 'participantIcon',
    PARTICIPANT_COLOR: 'participantColor',
    PARTICIPANT_NAME: 'participantName',
    NOTIFICATION: 'notification',
    SOUND: 'sound',
    IS_ACTIVE_SCREEN: 'isActiveScreen',
    EXPIRATION_TIME: 'expirationTime',
    UPDATE_INTERVAL: 'updateInterval',
    MAX_DISTANCE_RATIO: 'maxDistanceRatio',
    IS_NOW_DATE: 'isNowDate'
}

export const FIREBASE_ID_SET = 'idSet';

export class Participant {
    constructor(props) {
        const {
            name = '',
            isActive = false,
            icon = '',
            color = '',
            distToHead = null,
            distance = null,
            current = {},
            prev = {},
            sync = {}
        } = props;

        this.name = name;
        this.isActive = isActive;
        this.icon = icon;
        this.color = color;
        this.distToHead = distToHead;
        this.distance = distance;
        this.current = {
            latitude: current.latitude ? current.latitude : null,
            longitude: current.longitude ? current.longitude : null,
            speed: current.speed ? current.speed : null,
            altitude: current.altitude ? current.altitude : null,
            accuracy: current.accuracy ? current.accuracy : null,
            timestamp: current.timestamp ? current.timestamp : null,
        };
        this.prev = prev;
        this.sync = sync;
    }
}
