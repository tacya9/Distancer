import {LS_PROP} from "./constants.js";
import {getSettingFromLS} from "./helpers.js";

let wakeLock;

export default function handleScreenActivity() {
    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock активирован!');

            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock был отпущен.');
            });
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    };
    const releaseWakeLock = async () => {
        if (wakeLock) {
            await wakeLock.release();
            wakeLock = null;
            console.log('Wake Lock отпущен пользователем.');
        }
    };

    if (getSettingFromLS([LS_PROP.IS_ACTIVE_SCREEN])) {
        if (!wakeLock) requestWakeLock().finally(() => {
            console.log('finally >>> requestWakeLock');
        });
    } else {
        if (wakeLock) releaseWakeLock().finally(() => {
            console.log('finally >>> releaseWakeLock');
        });
    }
}
