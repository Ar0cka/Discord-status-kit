class FormElements {
    appIdInput;
    detailsInput;
    largeImageInput;
    largeTextInput;
    smallImageInput;
    smallTextInput;

    constructor() {
        this.appIdInput = document.getElementById("idInput");
        this.detailsInput = document.getElementById("detailsInput");
        this.largeImageInput = document.getElementById("large_image_input");
        this.largeTextInput = document.getElementById("large_text_input");
        this.smallImageInput = document.getElementById("small_image_input");
        this.smallTextInput = document.getElementById("small_text_input");
    }

    getValues() {
        const values = {
            appId: this.appIdInput.value,
            details: this.detailsInput.value,
            largeImage: this.largeImageInput.value,
            largeText: this.largeTextInput.value,
            smallImage: this.smallImageInput.value,
            smallText: this.smallTextInput.value,
        };
        console.log('Form values:', values);
        return values;
    }
}

const statusStyle = document.getElementById("connect_status");
const submitData = document.getElementById("send_data_btn");
const disconnect = document.getElementById("disconnect_btn");
const data = new FormElements();
const { ipcRenderer } = require('electron');

let connect_result = false;

async function sendData() {
    if (connect_result) {
        console.log("Already connected, skipping");
        return;
    }

    const send_data_struct = data.getValues();

    for (const [key, value] of Object.entries(send_data_struct)) {
        if (!value.trim()) {
            console.error(`Empty field: ${key}`);
            return;
        }
    }

    console.log('Sending data to main process');
    ipcRenderer.send('submit-form', send_data_struct);

    ipcRenderer.once('submit-form-response', (event, success) => {
        console.log('Received response:', success);
        if (success) {
            connect_result = true;
            statusStyle.style.backgroundColor = "green";
            console.log("RPC connection established");
        } else {
            statusStyle.style.backgroundColor = "red";
            console.error("Failed to connect to Discord");
        }
    });
}

async function disconnectFromDis() {
    if (!connect_result) {
        console.log("Not connected, skipping disconnect");
        return;
    }

    console.log('Sending disconnect signal');
    ipcRenderer.send('end-connect');

    ipcRenderer.once('end-connect-response', (event, success) => {
        console.log('Received disconnect response:', success);
        if (success) {
            connect_result = false;
            statusStyle.style.backgroundColor = "red";
            console.log("RPC disconnected successfully");
        } else {
            console.error("Failed to disconnect");
        }
    });
}

window.addEventListener('beforeunload', () => {
    if (connect_result) {
        console.log('Window closing, sending disconnect signal');
        ipcRenderer.send('end-connect');
    }
});

submitData.addEventListener('click', sendData);
disconnect.addEventListener('click', disconnectFromDis);