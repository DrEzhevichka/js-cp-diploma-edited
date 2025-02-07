let seanceInfo = JSON.parse(sessionStorage.getItem('seanceInfo')); 
let date = JSON.parse(sessionStorage.getItem('date'));
let hallInfo = JSON.parse(sessionStorage.getItem('hallInfo'));
document.querySelector('.ticket__title').innerText = seanceInfo.film;
document.querySelector('.ticket__start').innerText = `${date.day} в ${seanceInfo.time}`;
document.querySelector('.ticket__hall').innerText = hallInfo.hall;
document.querySelector('.ticket__chairs').innerText = hallInfo.places;
let qrWrapper = document.querySelector('.ticket__info-qr');
let qrInfo = `Билет действителен на: ${date.day}. Фильм: ${seanceInfo.film}. Начало сеанса: ${seanceInfo.time}. Зал: ${hallInfo.hall}, ряд/место: ${hallInfo.places}`;
let qrCode = QRCreator(qrInfo, {image: 'SVG'});
qrWrapper.append(qrCode.result);