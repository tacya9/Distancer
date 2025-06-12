import {
    getSettingFromLS,
    setSettingsToLS
} from "../../utils/helpers.js";
import {firebaseDB, getLastUpdateRef, getParticipantRef} from "../../utils/firebase/firebase.js";
import {LS_PROP, Participant} from "../../utils/constants.js";

export default class SettingsForm {
    constructor(props) {
        const {settings, onSubmitCallback} = props;

        this.settings = settings; // [{propName, type, label}, ...]
        this.onSubmitCallback = onSubmitCallback;
        this.element = this.createForm();
    }

    createForm() {
        const form = document.createElement('form');
        const submitButton = document.createElement('button');

        this.settings.forEach(setting => {
            const label = document.createElement('label');
            const input = document.createElement('input');

            input.type = setting.type;
            input.classList.add('form-control');
            input.classList.add('h-auto');

            if (setting.type === 'checkbox') {
                input.checked = getSettingFromLS(setting.propName, setting.defaultValue);
                input.classList.add('form-check-input');
                input.classList.add('m-0');

            } else {
                input.value = getSettingFromLS(setting.propName, setting.defaultValue);
            }

            label.classList.add('input-group');
            label.classList.add('mb-3');
            label.innerHTML = `<span class="input-group-text">${setting.label}</span>`;
            label.appendChild(input);

            form.appendChild(label);

            setting.input = input;
        });

        submitButton.type = 'submit';
        submitButton.innerText = 'Применить';
        submitButton.classList.add('btn');
        submitButton.classList.add('btn-primary');
        submitButton.classList.add('float-end');

        form.setAttribute('novalidate', '');
        form.appendChild(submitButton);
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const newSettings = {};
            const validateProps = [LS_PROP.DISTANCER_ID, LS_PROP.PARTICIPANT_NAME];
            let errorQty = 0;

            this.settings.forEach(setting => {
                newSettings[setting.propName] = setting.input.type === 'checkbox' ? setting.input.checked : setting.input.value;

                if (validateProps.includes(setting.propName) && hasForbiddenChars(setting.input.value)) ++errorQty;
            });

            if (errorQty) {
                alert('Поля не могут содержать символы:\n. # $ [ ]');

                return;
            }

            setSettingsToLS(newSettings);
            firebaseDB.ref(getParticipantRef(getSettingFromLS(LS_PROP.DISTANCER_ID), getSettingFromLS(LS_PROP.PARTICIPANT_NAME)))
                .set(new Participant({
                    name: getSettingFromLS(LS_PROP.PARTICIPANT_NAME),
                    isActive: true,
                    icon: getSettingFromLS(LS_PROP.PARTICIPANT_ICON)
                }))
            firebaseDB.ref(getLastUpdateRef(getSettingFromLS(LS_PROP.DISTANCER_ID))).set(+new Date());

            this.runHandlers();

            if (typeof this.onSubmitCallback === 'function') this.onSubmitCallback();
        })

        this.runHandlers();

        return form;
    }

    runHandlers() {
        this.settings.forEach(setting => {
            if (setting.onApply) setting.onApply();
        });
    }

    render(parent) {
        return parent ? parent.appendChild(this.element) : this.element;
    }
}

function hasForbiddenChars(input) {
    return /[.#$[\]]/.test(input);
}
