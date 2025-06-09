export const UPDATE_INTERVAL = 5000; // ms

export const LS_SETTINGS_NAME = 'distancer.settings';
export const LS_ACTIVE_NAME = 'distancer.isActive';

export const LS_PROP = {
    DISTANCER_ID: 'distancerId',
    PARTICIPANT_ICON: 'participantIcon',
    PARTICIPANT_NAME: 'participantName',
    IS_ACTIVE_SCREEN: 'isActiveScreen',
    EXPIRATION_TIME: 'expirationTime'
}

export const FIREBASE_ID_SET = 'idSet';

export class Participant {
    constructor(props) {
        const {
            name = '',
            icon = '',
            distToHead = null,
            distance = null,
            current = {},
            prev = {},
            sync = {}
        } = props;

        this.name = name;
        this.icon = icon;
        this.distToHead = distToHead;
        this.distance = distance;
        this.current = {
            latitude: current.latitude ? current.latitude : null,
            longitude: current.longitude ? current.longitude : null,
            speed: current.speed,
            altitude: current.altitude ? current.altitude : null,
            accuracy: current.accuracy ? current.accuracy : null,
            timestamp: current.timestamp ? current.timestamp : null,
        };
        this.prev = prev;
        this.sync = sync;
    }
}
