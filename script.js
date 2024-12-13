const video = document.getElementById('video');
const canvas = document.getElementById('qr-canvas');
const ctx = canvas.getContext('2d');
const qrResult = document.getElementById('qr-result');
const animatedImage = document.createElement('img'); // Создаём элемент изображения
animatedImage.src = 'animated-image.gif'; // Указываем путь к изображению

// Функция для захвата видео с камеры
function startVideo() {
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment", // Используем заднюю камеру
            width: { ideal: 640 }, // Желаемая ширина видео
            height: { ideal: 480 } // Желаемая высота видео
        }
    })
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
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth" // Улучшение распознавания
        });
        if (code) {
            qrResult.innerText = "QR Code Detected: " + code.data;
            showAnimatedImage();
            stopVideo(); // Останавливаем видео после распознавания QR-кода
        } else {
            qrResult.innerText = "No QR Code detected";
        }
    }
    requestAnimationFrame(tick);
}

// Функция для отображения оживающей картинки
function showAnimatedImage() {
    video.replaceWith(animatedImage); // Заменяем видео на изображение
    animatedImage.style.display = 'block'; // Отображаем изображение
}

// Функция для остановки видео
function stopVideo() {
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
}

// Запуск видео
startVideo();
