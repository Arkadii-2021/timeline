import { userLogin } from './setGeoPosition';

init(document.querySelector('.timeline'));

function init(el) {
  const textElement = el.querySelector('.text_messages');

  el.querySelector('.text_form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!(/^\s+$/.test(el.querySelector('.text_input').value)) && el.querySelector('.text_input').value !== '') {
      const msgElement = messageConstructor(
        el.querySelector('.text_input').value
      );
      textElement.prepend(msgElement);

    }
    el.querySelector('.text_input').value = '';
  });  
}

function messageConstructor(text) {
  const msgElement = document.createElement('div');
  msgElement.classList.add('text_message');
  
  const userHeader = document.createElement('div');
  userHeader.classList.add('text_message_container');
  
  const userDate = document.createElement('span');
  userDate.classList.add('text_message_date');
  userDate.innerHTML = getDateTime() + ',&nbsp';
    
  const geoPos = document.createElement('span');
  geoPos.dataset.id = 'geo-coord';
  geoPos.classList.add('text_message_date');
  getGeolocation(geoPos);
    
  const userText = document.createElement('div');
  userText.classList.add('message_text');
  userText.innerText = text;
  userHeader.append(userDate, geoPos);
  msgElement.append(userHeader, userText);
  
  return msgElement;
}

function getDateTime() {
	let timestamp = new Date();
  
  const getData = {
    'date': timestamp.getDate().toString().length < 2 
            ? timestamp.getDate().toString().padStart(2, '0') 
            : timestamp.getDate(),
    'month': timestamp.getMonth().toString().length < 2
            ? timestamp.getMonth().toString().padStart(2, '0') 
            : timestamp.getMonth(),
    'year': timestamp.getFullYear(),
	  'hours': timestamp.getHours().toString().length < 2
            ? timestamp.getHours().toString().padStart(2, '0') 
            : timestamp.getHours(),
	  'minutes': timestamp.getMinutes().toString().length < 2
            ? timestamp.getMinutes().toString().padStart(2, '0') 
            : timestamp.getMinutes(),
  };

  return `${getData.hours}:${getData.minutes} ${getData.date}.${getData.month + 1}.${getData.year}`;
};

function getGeolocation(geoPos) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (data) {
        const { latitude, longitude } = data.coords;
        geoPos.innerText = `широта: ${latitude}, долгота: ${longitude}`;
      },
      function () {
        userLogin(document.querySelector('.timeline'));
      },
      { enableHighAccuracy: true }
    );
  }  
}
