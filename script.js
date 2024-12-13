const video = document.getElementById('video');
const canvas = document.getElementById('qr-canvas');
const ctx = canvas.getContext('2d');
const qrResult = document.getElementById('qr-result');
const animatedImage = document.getElementById('animated-image').querySelector('img');

// Функция для захвата видео с камеры
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(function(err) {
            console.error("Error accessing camera: ", err);
            qrResult.innerText = "Camera access denied or not available.";
        });
}

// Функция для обработки кадра видео
function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            qrResult.innerText = "QR Code Detected: " + code.data;
            showAnimatedImage();
        } else {
            qrResult.innerText = "No QR Code detected";
        }
    }
    requestAnimationFrame(tick);
}

// Функция для отображения оживающей картинки
function showAnimatedImage() {
    animatedImage.style.display = 'block';
}

// Запуск видео
startVideo();