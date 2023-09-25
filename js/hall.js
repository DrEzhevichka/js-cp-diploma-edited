let confStepWrapper = document.querySelector('.conf-step__wrapper');
let acceptinBtn = document.querySelector('.acceptin-button');
let seanceInfo = JSON.parse(sessionStorage.getItem('seanceInfo'));
let date = JSON.parse(sessionStorage.getItem('date'));
let hallConfig = sessionStorage.getItem('hallConfig');
let timestamp = date.time + Number(seanceInfo.start * 60);
document.addEventListener("DOMContentLoaded", () => config(timestamp, seanceInfo.hallId, seanceInfo.id));
let seanseDate = `Начало сеанса: ${date.day} в ${seanceInfo.time}`;
document.querySelector('.buying__info-start').innerText = seanseDate;
document.querySelector('.buying__info-title').innerText = seanceInfo.film;
document.querySelector('.buying__info-hall').innerText = seanceInfo.hall;
document.querySelector('.price-standart').innerText = seanceInfo.standardPrice;
document.querySelector('.price-vip').innerText = seanceInfo.vipPrice;
async function config(value1, value2, value3) {
   let request = `event=get_hallConfig&timestamp=${value1}&hallId=${value2}&seanceId=${value3}`;
   let configuration = await createRequest(request);
   let hallHTML = (configuration === null) ? hallConfig : configuration; 
   confStepWrapper.insertAdjacentHTML('beforeend', hallHTML);
   acceptinBtn.addEventListener('click', function(event) {
      event.preventDefault();
      window.location.href = 'payment.html';
   });
   let rows = Array.from(document.querySelectorAll('.conf-step__row'));
   for (let row of rows) {
      let seats = Array.from(row.querySelectorAll('.conf-step__chair'));
      seats.forEach(seat => {
         seat.dataset.row = rows.indexOf(row) + 1;
         seat.dataset.place = seats.indexOf(seat) + 1;
      });
   }
   confStepWrapper.addEventListener('click', function(e) {
      if (e.target.classList.contains('conf-step__chair') && !e.target.classList.contains('conf-step__chair_taken') && !e.target.classList.contains('conf-step__chair_disabled')) {
         e.target.classList.toggle('conf-step__chair_selected');
         updateSelectedCount();
      }
   });
   function updateSelectedCount() {
      let selectedSeats = confStepWrapper.querySelectorAll('.conf-step__chair_selected');
      if (selectedSeats.length > 0) {
         acceptinBtn.removeAttribute('disabled');
         let seats = [];
         let countPrice = 0;
         selectedSeats.forEach(seat => {
            seats.push({
               row: seat.dataset.row,
               place: seat.dataset.place
            });
            if (seat.classList.contains('conf-step__chair_vip')) {
               countPrice += Number(seanceInfo.vipPrice);
            } else {
               countPrice += Number(seanceInfo.standardPrice);
            }
         });
         let buyInfo = {selectedSeats: seats, totalPrice: countPrice}
         sessionStorage.setItem('buyInfo', JSON.stringify(buyInfo));
         sessionStorage.setItem('timestamp', timestamp);
         sessionStorage.setItem('hallConfig', confStepWrapper.innerHTML);
      } else {
         acceptinBtn.setAttribute('disabled', 'disabled');
      }
   }
}