// Константы для элементов профиля
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const nameInput = document.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');

// Константы для попапов
const popups = document.querySelectorAll('.popup');
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// Константы для форм
const profileForm = document.querySelector('.popup__form_type_edit');
const cardForm = document.querySelector('.popup__form_type_new-card');

// Константы для карточек
const cardsList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

// Константы для элементов внутри попапов
const popupImage = imagePopup?.querySelector('.popup__image');
const popupCaption = imagePopup?.querySelector('.popup__caption');

initialCards.forEach((cardData) => {
    const card = createCard(cardData);
    cardsList.append(card);
});

function closePopup(popup) {
    if (popup) {
        popup.classList.remove('popup_is-opened');
    }
}

function openPopup(popup) {
    if (popup) {
        popup.classList.add('popup_is-opened', 'popup_is-animated');
    }
}

function createCard(cardData) {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    
    if (cardImage && cardTitle) {
        cardImage.src = cardData.link;
        cardImage.alt = cardData.name;
        cardTitle.textContent = cardData.name;
        
        setCardListeners(cardElement, cardImage, cardData);
    }
    
    return cardElement;
}

function setCardListeners(cardElement, cardImage, cardData) {
    const likeButton = cardElement.querySelector('.card__like-button');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    
    if (likeButton) {
        likeButton.addEventListener('click', handleLikeCard);
    }
    if (deleteButton) {
        deleteButton.addEventListener('click', () => handleDeleteCard(cardElement));
    }
    if (cardImage) {
        cardImage.addEventListener('click', () => handleCardImageClick(cardData));
    }
}

function handleLikeCard(evt) {
    if (evt.target) {
        evt.target.classList.toggle('card__like-button_is-active');
    }
}

function handleDeleteCard(card) {
    if (card) {
        card.remove();
    }
}

function handleCardImageClick(cardData) {
    if (popupImage && popupCaption) {
        popupImage.src = cardData.link;
        popupImage.alt = cardData.name;
        popupCaption.textContent = cardData.name;
        openPopup(imagePopup);
    }
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    if (profileTitle && profileDescription) {
        profileTitle.textContent = nameInput.value;
        profileDescription.textContent = descriptionInput.value;
        closePopup(profilePopup);
    }
}

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const cardNameInput = cardForm?.querySelector('.popup__input_type_card-name');
    const cardUrlInput = cardForm?.querySelector('.popup__input_type_url');
    
    if (cardNameInput && cardUrlInput) {
        const cardData = {
            name: cardNameInput.value,
            link: cardUrlInput.value
        };
        const newCard = createCard(cardData);
        cardsList.prepend(newCard);
        closePopup(cardPopup);
        cardForm.reset();
    }
}

function openProfilePopup() {
    if (nameInput && descriptionInput && profileTitle && profileDescription) {
        nameInput.value = profileTitle.textContent;
        descriptionInput.value = profileDescription.textContent;
        openPopup(profilePopup);
    }
}

if (profileEditButton) {
    profileEditButton.addEventListener('click', openProfilePopup);
}
if (addCardButton) {
    addCardButton.addEventListener('click', () => openPopup(cardPopup));
}

popups.forEach((popup) => {
    const closeButton = popup?.querySelector('.popup__close');
    if (closeButton) {
        closeButton.addEventListener('click', () => closePopup(popup));
    }
});

if (profileForm) {
    profileForm.addEventListener('submit', handleProfileFormSubmit);
}
if (cardForm) {
    cardForm.addEventListener('submit', handleCardFormSubmit);
}

function showInputError(formElement, inputElement, errorMessage) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add('popup__input_type_error');
    errorElement.textContent = errorMessage;
    errorElement.classList.add('popup__error_visible');
}

function hideInputError(formElement, inputElement) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove('popup__input_type_error');
    errorElement.classList.remove('popup__error_visible');
    errorElement.textContent = '';
}

function checkInputValidity(formElement, inputElement) {
    if (!inputElement.validity.valid) {
        if (inputElement.validity.valueMissing) {
            showInputError(formElement, inputElement, 'Вы пропустили это поле');
        } else if (inputElement.validity.tooShort) {
            showInputError(
                formElement, 
                inputElement, 
                `Минимальное количество символов: ${inputElement.getAttribute('minlength')}. Длина текста сейчас: ${inputElement.value.length}`
            );
        } else {
            showInputError(formElement, inputElement, inputElement.validationMessage);
        }
    } else {
        hideInputError(formElement, inputElement);
    }
}

function hasInvalidInput(inputList) {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
}

function toggleButtonState(inputList, buttonElement) {
    if (hasInvalidInput(inputList)) {
        buttonElement.classList.add('popup__button_disabled');
        buttonElement.disabled = true;
    } else {
        buttonElement.classList.remove('popup__button_disabled');
        buttonElement.disabled = false;
    }
}

function setEventListeners(formElement) {
    const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
    const buttonElement = formElement.querySelector('.popup__button');
    
    toggleButtonState(inputList, buttonElement);
    
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', function () {
            checkInputValidity(formElement, inputElement);
            toggleButtonState(inputList, buttonElement);
        });
    });
}

function enableValidation() {
    const formList = Array.from(document.querySelectorAll('.popup__form'));
    formList.forEach((formElement) => {
        formElement.addEventListener('submit', function (evt) {
            evt.preventDefault();
        });
        setEventListeners(formElement);
    });
}

enableValidation();
