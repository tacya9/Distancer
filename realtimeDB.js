import {
    ref, get, set, remove,
} from 'firebase/database';
import { realtimeDB } from './firebaseConfig';

export const getRealtimeDBRef = (refPath) => ref(realtimeDB, `realtimeDB/${refPath}`);

export const setDataToRealtimeDB = (props) => {
    const {
        refPath, data, errorCallback,
    } = props;

    set(getRealtimeDBRef(refPath), data)
        .then(() => {
            console.info('Data has been added to RealtimeDB successfully');
        })
        .catch((error) => {
            errorCallback && errorCallback(error);
        })
        .finally(() => {
            console.info('set is complete');
        });
};

export const getDataFromRealtimeDB = (props) => {
    const {
        refPath, successCallback, errorCallback,
    } = props;

    get(getRealtimeDBRef(refPath))
        .then((snapshot) => {
            if (snapshot.exists()) {
                successCallback && successCallback({ data: snapshot.val() });
            }
        })
        .catch((error) => {
            errorCallback && errorCallback(error);
        })
        .finally(() => {
            console.info('get is complete');
        });
};

export const removeDataFromRealtimeDB = (props) => {
    const { refPath, errorCallback } = props;

    remove(getRealtimeDBRef(refPath))
        .then(() => {
            console.info('User data has been removed from RealtimeDB successfully');
        })
        .catch((error) => {
            errorCallback && errorCallback(error);
        })
        .finally(() => {
            console.info('remove is complete');
        });
};
