import SettingsForm from '../components/settings/settings.js';
import handleScreenActivity from '../utils/screenActivity.js';
import {LS_PROP} from "../utils/constants.js";
import {clearOutdatedIds, getIsActiveFromLS, setIsActiveToLS, updateViewFromLS} from "../utils/helpers.js";
import Participants from "../components/participants/participants.js";

const runButton = document.getElementById('runButton');
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.getElementById('closeModalButton');
const modal = document.getElementById('modal');
const participantList = document.getElementById('participantList');
const participants = new Participants();
const settingsWrapper = document.getElementById('settingsForm');
const settingsForm = new SettingsForm({
    settings: [
        {
            propName: LS_PROP.DISTANCER_ID,
            type: 'text',
            label: 'Идентификатор'
        },
        {
            propName: LS_PROP.PARTICIPANT_ICON,
            type: 'text',
            label: '<a href="https://fontawesome.com/search?o=r&ic=free&s=solid&ip=classic" target="_blank">Название иконки</a>',
            defaultValue: 'car'
        },
        {
            propName: LS_PROP.PARTICIPANT_COLOR,
            type: 'color',
            label: 'Цвет',
            defaultValue: '#ffffff'
        },
        {
            propName: LS_PROP.PARTICIPANT_NAME,
            type: 'text',
            label: 'Имя'
        },
        {
            propName: LS_PROP.IS_ACTIVE_SCREEN,
            type: 'checkbox',
            label: 'Экран всегда включен',
            onApply: handleScreenActivity
        },
        {
            propName: LS_PROP.EXPIRATION_TIME,
            type: 'number',
            label: 'Макс.вр отобр неак.уч, сек',
            defaultValue: 15
        },
        {
            propName: LS_PROP.UPDATE_INTERVAL,
            type: 'number',
            label: 'Время обновления данных, мс',
            defaultValue: 2000
        },
        {
            propName: LS_PROP.MAX_DISTANCE_RATIO,
            type: 'number',
            label: 'Коэф. макс. дистанции',
            defaultValue: 2
        },
        {
            propName: LS_PROP.IS_NOW_DATE,
            type: 'checkbox',
            label: 'Учесть вр.погрешность',
            defaultValue: false
        }
    ],
    onSubmitCallback() {
        participants.run(false);
        setIsActiveToLS(false);
        modal.classList.remove('show');
    }
});

runButton.addEventListener('click', () => {
    const isActive = !getIsActiveFromLS();

    participants.run(isActive);
    setIsActiveToLS(isActive);
});
openModalButton.addEventListener('click', () => {
    modal.classList.add('show');
});
closeModalButton.addEventListener('click', () => {
    modal.classList.remove('show');
});

settingsForm.render(settingsWrapper);
participants.render(participantList);

setIsActiveToLS(false);
updateViewFromLS();
clearOutdatedIds();
