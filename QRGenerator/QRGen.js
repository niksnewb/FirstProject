let inputText = document.getElementById("inputText");
let QRimg = document.getElementById("QRimg");

function generateQR() {
    console.log(inputText.value)
    QRimg.src = ""
    if(inputText.value.length > 0) {
        QRimg.src =  "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + inputText.value
    }
    else{
        inputText.classList.add("error")
        setInterval(() => {
            inputText.classList.remove("error")
        }, 1000);
    }
}