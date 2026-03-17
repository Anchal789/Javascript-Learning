'use strict';

// ===== Base Class =====
class Activity {
  date = new Date();
  uid = (Date.now() + '').slice(-10);
  clickCount = 0;

  constructor(location, distance, time) {
    this.location = location; // [lat, lng]
    this.distance = distance;
    this.time = time;
  }

  setSummary() {
    const monthList = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];

    this.summary = `${this.category[0].toUpperCase()}${this.category.slice(1)} on ${
      monthList[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  registerClick() {
    this.clickCount++;
  }
}

// ===== Running =====
class Jogging extends Activity {
  category = 'running';

  constructor(location, distance, time, cadence) {
    super(location, distance, time);
    this.cadence = cadence;
    this.calculatePace();
    this.setSummary();
  }

  calculatePace() {
    this.pace = this.time / this.distance;
    return this.pace;
  }
}

// ===== Cycling =====
class Biking extends Activity {
  category = 'cycling';

  constructor(location, distance, time, elevation) {
    super(location, distance, time);
    this.elevation = elevation;
    this.calculateSpeed();
    this.setSummary();
  }

  calculateSpeed() {
    this.speed = this.distance / (this.time / 60);
    return this.speed;
  }
}

// ===== DOM Elements =====
const formEl = document.querySelector('.form');
const listContainer = document.querySelector('.workouts');
const typeInput = document.querySelector('.form__input--type');
const distInput = document.querySelector('.form__input--distance');
const timeInput = document.querySelector('.form__input--duration');
const cadenceInput = document.querySelector('.form__input--cadence');
const elevationInput = document.querySelector('.form__input--elevation');

// ===== App Controller =====
class TrackerApp {
  #mapInstance;
  #zoomLevel = 13;
  #mapClickEvent;
  #records = [];

  constructor() {
    this.initLocation();
    this.loadFromStorage();

    formEl.addEventListener('submit', this.createEntry.bind(this));
    typeInput.addEventListener('change', this.toggleFields);
    listContainer.addEventListener('click', this.focusOnMap.bind(this));
  }

  initLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      this.initializeMap.bind(this),
      () => alert('Location access denied')
    );
  }

  initializeMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#mapInstance = L.map('map').setView(coords, this.#zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.#mapInstance);

    this.#mapInstance.on('click', this.showForm.bind(this));

    this.#records.forEach(item => this.renderMarker(item));
  }

  showForm(event) {
    this.#mapClickEvent = event;
    formEl.classList.remove('hidden');
    distInput.focus();
  }

  hideForm() {
    distInput.value =
      timeInput.value =
      cadenceInput.value =
      elevationInput.value =
        '';

    formEl.style.display = 'none';
    formEl.classList.add('hidden');

    setTimeout(() => (formEl.style.display = 'grid'), 1000);
  }

  toggleFields() {
    elevationInput.closest('.form__row').classList.toggle('form__row--hidden');
    cadenceInput.closest('.form__row').classList.toggle('form__row--hidden');
  }

  createEntry(e) {
    e.preventDefault();

    const isValid = (...vals) => vals.every(v => Number.isFinite(v));
    const isPositive = (...vals) => vals.every(v => v > 0);

    const type = typeInput.value;
    const distance = +distInput.value;
    const time = +timeInput.value;
    const { lat, lng } = this.#mapClickEvent.latlng;

    let entry;

    if (type === 'running') {
      const cadence = +cadenceInput.value;

      if (!isValid(distance, time, cadence) || !isPositive(distance, time, cadence))
        return alert('Invalid input');

      entry = new Jogging([lat, lng], distance, time, cadence);
    }

    if (type === 'cycling') {
      const elevation = +elevationInput.value;

      if (!isValid(distance, time, elevation) || !isPositive(distance, time))
        return alert('Invalid input');

      entry = new Biking([lat, lng], distance, time, elevation);
    }

    this.#records.push(entry);

    this.renderMarker(entry);
    this.renderList(entry);

    this.hideForm();
    this.saveToStorage();
  }

  renderMarker(entry) {
    L.marker(entry.location)
      .addTo(this.#mapInstance)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${entry.category}-popup`,
        })
      )
      .setPopupContent(
        `${entry.category === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${entry.summary}`
      )
      .openPopup();
  }

  renderList(entry) {
    let markup = `
      <li class="workout workout--${entry.category}" data-id="${entry.uid}">
        <h2 class="workout__title">${entry.summary}</h2>
        <div class="workout__details">
          <span>${entry.distance}</span> km
        </div>
        <div class="workout__details">
          <span>${entry.time}</span> min
        </div>
    `;

    if (entry.category === 'running') {
      markup += `
        <div>${entry.pace.toFixed(1)} min/km</div>
        <div>${entry.cadence} spm</div>
      `;
    }

    if (entry.category === 'cycling') {
      markup += `
        <div>${entry.speed.toFixed(1)} km/h</div>
        <div>${entry.elevation} m</div>
      `;
    }

    markup += `</li>`;

    formEl.insertAdjacentHTML('afterend', markup);
  }

  focusOnMap(e) {
    if (!this.#mapInstance) return;

    const itemEl = e.target.closest('.workout');
    if (!itemEl) return;

    const record = this.#records.find(r => r.uid === itemEl.dataset.id);

    this.#mapInstance.setView(record.location, this.#zoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  saveToStorage() {
    localStorage.setItem('activities', JSON.stringify(this.#records)); 
  }

  loadFromStorage() {
    const stored = JSON.parse(localStorage.getItem('activities'));
    if (!stored) return;

    this.#records = stored;

    this.#records.forEach(item => this.renderList(item));
  }

  clearStorage() {
    localStorage.removeItem('activities');
    location.reload();
  }
}

const tracker = new TrackerApp();