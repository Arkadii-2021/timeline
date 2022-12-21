export function userLogin(el) {
  const container = document.createElement('div');
  container.classList.add('login');
    
  const confirmForm = document.createElement('form');
  confirmForm.classList.add('login_form');
    
  const nickNameTitle = document.createElement('h3');
  nickNameTitle.textContent = 'Что-то пошло не так';
  
  const nickNameDescription = document.createElement('p');
  nickNameDescription.textContent = 'К сожалениею, определить ваше местоположение нам не удалось. Пожалуйста, дайте разрешение на использование геолокации или введите координаты вручную.';
    
  const loginContainer = document.createElement('div');
  loginContainer.classList.add('login_container');
    
  const loginInput = document.createElement('input');
  loginInput.classList.add('login_input');

  loginInput.setAttribute('placeholder', '55.0207488, 82.9652992');
    
  const ok = document.createElement('button');
  ok.setAttribute('type', 'submit');
  ok.textContent = 'ОК';
  
  const cancel = document.createElement('button');
  cancel.classList.add('cancel');
  cancel.style = 'margin-left: 20px;';
  cancel.textContent = 'Отмена';
    
  el.append(container);
  container.append(confirmForm);
  confirmForm.append(nickNameTitle, nickNameDescription, loginContainer, ok, cancel);
  loginContainer.append(loginInput);

  const form = el.querySelector('.login_form');
  const nickElement = el.querySelector('.login_input');

  ok.addEventListener('click', (e) => {
    e.preventDefault();
    checkGeoPos(el, ok, form, container, el.querySelector('.login_input').value);
  }); 
  document.querySelector('.cancel').addEventListener('click', (e) => {
    e.preventDefault();
    el.querySelector('[data-id="geo-coord"]').textContent = 'местоположение не указано'
    form.remove();
    container.remove();
  });
}

function checkGeoPos(el, ok, form, container, coord) {
    if (!(/^\s+$/.test(coord)) 
      && coord !== '' 
      && /^[-]?([1-8]?\d(\.\d+)?|90(\.0+)?), \s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/gm.test(coord)) {
        el.querySelector('[data-id="geo-coord"]').textContent = coord;
        form.remove();
        container.remove();
        return true;
    } else {
      showError(el);
      return false;
    }
}

function showError(el) {
  if (el.querySelector('.login_error')) el.querySelector('.login_error').remove();
  const error = document.createElement('div');
  error.classList.add('login_error');
  error.innerText = 'Необходмо правильно указать координаты';
  el.querySelector('.login_container').append(error);
  el.querySelector('.login_input').addEventListener('focus', () => {
    const error = el.querySelector('.login_error');
    if (error) {
      error.remove();
    }      
  });
}
