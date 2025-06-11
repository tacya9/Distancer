import SettingsForm from '../components/settings/settings.js';
import handleScreenActivity from '../utils/screenActivity.js';
import {LS_PROP} from "../utils/constants.js";
import {clearOutdatedIds, getIsActiveFromLS, setIsActiveToLS, updateViewFromLS} from "../utils/helpers.js";
import Participants from "../components/participants/participants.js";

const runButton = document.getElementById('runButton');
const participantList = document.getElementById('participantList');
const participants = new Participants();
const settingsWrapper = document.getElementById('settingsForm');
const settingsForm = new SettingsForm({
    settings: [
        {
            propName: LS_PROP.DISTANCER_ID,
            type: 'text',
            label: 'Distancer ID'
        },
        {
            propName: LS_PROP.PARTICIPANT_ICON,
            type: 'text',
            label: 'Icon'
        },
        {
            propName: LS_PROP.PARTICIPANT_COLOR,
            type: 'color',
            label: 'Color',
            defaultValue: '#ffffff'
        },
        {
            propName: LS_PROP.PARTICIPANT_NAME,
            type: 'text',
            label: 'Name'
        },
        {
            propName: LS_PROP.IS_ACTIVE_SCREEN,
            type: 'checkbox',
            label: 'The display is always active',
            onApply: handleScreenActivity
        },
        {
            propName: LS_PROP.EXPIRATION_TIME,
            type: 'number',
            label: 'Expiration time (sec)',
            defaultValue: 15
        },
        {
            propName: LS_PROP.UPDATE_INTERVAL,
            type: 'number',
            label: 'Update interval (ms)',
            defaultValue: 5000
        },
        {
            propName: LS_PROP.MAX_DISTANCE_RATIO,
            type: 'number',
            label: 'Max distance ratio',
            defaultValue: 2
        }
    ],
    onSubmitCallback() {
        participants.run(false);
        setIsActiveToLS(false);
    }
});

runButton.addEventListener('click', () => {
    const isActive = !getIsActiveFromLS();

    participants.run(isActive);
    setIsActiveToLS(isActive);
});

settingsForm.render(settingsWrapper);
participants.render(participantList);

setIsActiveToLS(false);
updateViewFromLS();
clearOutdatedIds();
