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
const update = document.getElementById("update_btn");
const data = new FormElements();

let connect_result = false;

async function sendData() {
    if (!CheckInputs){
        return;
    }

    const send_data_struct = data.getValues();

    console.log('Sending data to main process');
    window.electronApi.sendData(send_data_struct)
}

async function disconnectFromDis() {
    console.log('Sending disconnect signal');
    window.electronApi.sendDisconnect('end-connect');
}

async function updateDatas(){
    if (!CheckInputs){
        return;
    }

    const send_data_struct = data.getValues();
    console.log('Send data for update');
    window.electronApi.updateData(send_data_struct);
}

window.electronApi.updateStatus((status) => {
    console.log("change status = ", status)

    let command = status['command']

    switch (command){
        case 'start':
            statusStyle.style.backgroundColor = "green";
            break;
        case 'stop':
            statusStyle.style.backgroundColor = "red";
            break;
        default:
            console.log("not find this type")
    }
})

window.addEventListener('beforeunload', () => {
    if (connect_result) {
        console.log('Window closing, sending disconnect signal');

    }
});

let idInput = document.getElementById("idInput");
let largeImgInput = document.getElementById("large_image_input");
let smallImgInput = document.getElementById("small_image_input");

function CheckInputs(){
    if (!idInput.value || !largeImgInput.value || !smallImgInput.value){
        console.log("Not find needed values");
        return false;
    }

    return true;
}

submitData.addEventListener('click', sendData);
disconnect.addEventListener('click', disconnectFromDis);
update.addEventListener('click', updateDatas);