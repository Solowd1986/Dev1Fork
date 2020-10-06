"use strict";


/*  1. Передаем селектор формы и класс, использущийся для иллюстрации ошибок
    2. Формируем список полей, которые будем проверять на blur, чтобы не было там submit/radio и так далее
    3. Для каждой формы отключаем стандартную реакцию на invalid-событие, так обработка ошибок работает, но вывод кастомизируется
    4. Для каждого поля формы перехватываем blur и если валидация не пройдена - выделяем поле
    5. Несмотря на то, что стандартное поведение invalid отключено, отправка все равно будет заблокирована, пока все поля не valid
================================
*/

const formErrorsHandler = (formSelector, fieldErrorClass) => {
    
    const formList = document.querySelectorAll(formSelector);
    const checkFields = ["text", "password", "email", "tel"];
    const formErrors = {};
    
    if (formList.length > 0) {

        formList.forEach(form => form.addEventListener("invalid", function (evt) {
                evt.preventDefault();
                }, true)
        );

        formList.forEach(form => {
            form.addEventListener("blur", function (evt) {
              evt.preventDefault();

              if (checkFields.includes(evt.target.type)) {
                  if (!evt.target.checkValidity()) {
                      evt.target.classList.add(fieldErrorClass);
                      for (const key in evt.target.validity) {
                          if (evt.target.validity[key] === true) {
                              formErrors[evt.target.name] = key;
                          }
                      }
                  } else {
                      evt.target.classList.remove(fieldErrorClass);
                  }
              }
              if (Object.keys(formErrors).length > 0) {
                  console.log(`Errors in form "${this.name}:"`, formErrors);
              }
          }, true);
        })
    }
};

export default formErrorsHandler;
