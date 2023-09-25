let seanceInfo = JSON.parse(sessionStorage.getItem('seanceInfo')); 
let date = JSON.parse(sessionStorage.getItem('date'));
let buyInfo = JSON.parse(sessionStorage.getItem('buyInfo'));
let timestamp = sessionStorage.getItem('timestamp');
let hallConfiguration = sessionStorage.getItem('hallConfig');
document.addEventListener("DOMContentLoaded", () => booking(timestamp, seanceInfo.hallId, seanceInfo.id, hallConfiguration));
let infoHall = document.querySelector('.ticket__hall');
let infoPlaces = document.querySelector('.ticket__chairs');
let seanseDate = `${date.day} в ${seanceInfo.time}`;
let allChairs = buyInfo.selectedSeats;
allChairs.forEach(chair => {
   	infoPlaces.innerText += ` ${chair.row}/${chair.place}, `;
});
infoHall.innerText = seanceInfo.hall.slice(3);
infoPlaces.innerText = infoPlaces.innerText.slice(0, - 1);
document.querySelector('.ticket__title').innerText = seanceInfo.film;
document.querySelector('.ticket__start').innerText = seanseDate;
document.querySelector('.ticket__cost').innerText = buyInfo.totalPrice;
let obj = {
   	places: infoPlaces.innerText,
   	hall: infoHall.innerText
}
sessionStorage.setItem('hallInfo', JSON.stringify(obj));
async function booking(value1, value2, value3, value4) {
	let request = `event=sale_add&timestamp=${value1}&hallId=${value2}&seanceId=${value3}&hallConfiguration=${value4}`;
   	await createRequest(request);
}