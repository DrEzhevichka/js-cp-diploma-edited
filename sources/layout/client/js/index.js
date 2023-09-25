class Timeline {
  constructor(date = new Date()) {
    this.currentDate = date;
  }
  get navigation() {
    return document.querySelector('.page-nav');
  }
  get sections() {
    return this.navigation.querySelectorAll('.page-nav__day');
  }
  getTimeline() {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    for (let section of this.sections) {
      const weekDay = section.querySelector('.page-nav__day-week');
      const dateNum = section.querySelector('.page-nav__day-number');
      let day = this.currentDate.getDate();
      if (day < 10) day = '0' + day;
      let month = (this.currentDate.getMonth() + 1);
      if (month < 10) month = '0' + month;
      let currentDay = this.currentDate.getDay();
      if (currentDay === 0 || currentDay  === 6) {
        section.classList.add('page-nav__day_weekend');
      }
      weekDay.innerText = days[currentDay];
      dateNum.innerText = `${day}.${month}`;
      section.dataset.date = `${day}.${month}.${this.currentDate.getFullYear()}`;
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
  }
  setSeancesTimeline(timestamp) {
    const timeBlocks = document.querySelectorAll('.movie-seances__time');
    const navItems = Array.from(this.sections);
    navItems.forEach(item => {
      const index = navItems.indexOf(item);
      item.dataset.day = timestamp + (index * 24 * 3600 * 1000);
      item.addEventListener('click', function(event) {
        event.preventDefault();
        navItems.forEach(nav => {
          nav.classList.remove('page-nav__day_chosen');
        });
        item.classList.add('page-nav__day_chosen');
        const activeDay = document.querySelector('.page-nav__day_chosen');
        timeBlocks.forEach(block => {
          const startTime = Number(block.dataset.start) * 60 * 1000;
          const dayTimestamp = Number(activeDay.dataset.day);
          if (Date.now() > (dayTimestamp + startTime)) {
            block.classList.add('acceptin-button-disabled');
          } else {
            block.classList.remove('acceptin-button-disabled');
          }
        });
      });
    });
    navItems[0].click();
  }
}
class Film {
  constructor() {
    this.filmsWrapper = document.querySelector('main');
  }
  fillInfo(data) {
    for (let item of data) {
      let duration = item['film_duration'];
      function getDuration() {
        if (duration % 10 === 1) {
          return `${duration} минута`;
        } else if (duration % 10 === 2 || duration % 10 === 3 || duration % 10 === 4) {
          return `${duration} минуты`;
        } else {
          return `${duration} минут`;
        }
      }
      const infoHTML = `
        <section class="movie" data-id="${item['film_id']}">
          <div class="movie__info">
            <div class="movie__poster">
              <img class="movie__poster-image" alt="Звёздные войны постер" src="${item['film_poster']}">
            </div>
            <div class="movie__description">
              <h2 class="movie__title">${item['film_name']}</h2>
              <p class="movie__synopsis">${item['film_description']}</p>
              <p class="movie__data">
                <span class="movie__data-duration">${getDuration()}</span>
                <span class="movie__data-origin">${item['film_origin']}</span>
              </p>
            </div>
          </div>
        </section>`;
      this.filmsWrapper.insertAdjacentHTML('beforeend', infoHTML);
    }
  }
}
class Hall {
  static getHall(halls) {
    let result = halls.filter(hall => hall['hall_open'] === '1');
    return result;
  }
}
class Seance {
  constructor(seances) {
    this.seances = seances;
  }
  get movies() {
    return document.querySelectorAll('.movie');
  }
  set openHalls(data) {
    this.halls = data;
  }
  get openHalls() {
    return this.halls;
  }
  showSeances() {
    const openHalls = this.openHalls;
    this.movies.forEach(movie => {
      openHalls.forEach(hall => {
        const seances = this.seances.filter(item => item['seance_hallid'] === hall['hall_id'] && item['seance_filmid'] === movie.dataset.id);
        if (seances.length > 0) {
          let seanceHTML = `
            <div class="movie-seances__hall" data-id="${hall['hall_id']}">
              <h3 class="movie-seances__hall-title">${hall['hall_name']}</h3>
              <ul class="movie-seances__list">`;
          for (let seance of seances) {
            const obj = {
              film: movie.querySelector('.movie__title').innerText,
              time: seance['seance_time'],
              start: seance['seance_start'],
              id: seance['seance_id'],
              hall: hall['hall_name'],
              hallId: hall['hall_id'],
              standardPrice: hall['hall_price_standart'],
              vipPrice: hall['hall_price_vip']
            };
            const seanceInfo = JSON.stringify(obj);
            seanceHTML += `<li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html" data-info='${seanceInfo}' data-start='${seance['seance_start']}'>${seance['seance_time']}</a></li>`;
          }
          seanceHTML += `</ul></div>`;
          movie.insertAdjacentHTML('beforeend', seanceHTML);
        }
      });
      movie.addEventListener('click', function(e) {
        let timeObject = {
          day: document.querySelector('.page-nav__day_chosen').dataset.date,
          time: Number(document.querySelector('.page-nav__day_chosen').dataset.day) / 1000
        }
        if (e.target.classList.contains('movie-seances__time')) {
          let idHall = e.target.closest('.movie-seances__hall').dataset.id;
          let currentHall = openHalls.find(hall => hall['hall_id'] === idHall);
          sessionStorage.setItem('date', JSON.stringify(timeObject));
          sessionStorage.setItem('seanceInfo', e.target.dataset.info);
          sessionStorage.setItem('hallConfig', currentHall['hall_config']);
        }
      });
    });
  }
}
document.addEventListener("DOMContentLoaded", () => start());
let currentTime = new Date();
currentTime.setHours(0, 0, 0, 0);
let timestamp = currentTime.getTime();
let timelineWeek = new Timeline();
timelineWeek.getTimeline();
async function start() {
  let response = await createRequest('event=update');
  let films = response.films.result;
  let halls = response.halls.result;
  let seances = response.seances.result;
  let film = new Film();
  film.fillInfo(films);
  let seance = new Seance(seances);
  seance.openHalls = Hall.getHall(halls);
  seance.showSeances();
  timelineWeek.setSeancesTimeline(timestamp);
}