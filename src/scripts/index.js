/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { initialCards } from "./cards.js";
import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { exportCards, importCards } from "./components/dataExport.js";

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// DOM-элементы
const placesWrap = document.querySelector(".places__list");

const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const cardArticleInput = cardForm.querySelector(".popup__input_type_article");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const exportButton = document.querySelector("#export-cards-button");
const importButton = document.querySelector("#import-cards-button");
const importInput = document.querySelector("#import-cards-input");

const importStatus = document.createElement("p");
importStatus.className = "places__status";
importStatus.setAttribute("role", "status");
document.querySelector(".places__tools").append(importStatus);

let currentCards = initialCards.map((card) => ({
  ...card,
  article: null,
  liked: false,
}));

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const createCard = (data) => {
  return createCardElement(data, {
    onPreviewPicture: handlePreviewPicture,

    onLikeIcon: (likeButton) => {
      likeCard(likeButton);
      data.liked = likeButton.classList.contains("card__like-button_is-active");
    },

    onDeleteCard: (cardElement) => {
      deleteCard(cardElement);
      currentCards = currentCards.filter((card) => card !== data);
    },
  });
};

const renderCards = (cards) => {
  const fragment = document.createDocumentFragment();

  cards.forEach((card) => {
    fragment.append(createCard(card));
  });

  placesWrap.replaceChildren(fragment);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;

  closeModalWindow(profileFormModalWindow);
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();

  profileAvatar.style.backgroundImage = `url("${avatarInput.value}")`;

  closeModalWindow(avatarFormModalWindow);
  avatarForm.reset();
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  const cardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
    article: cardArticleInput.value,
    liked: false,
  };

  currentCards.unshift(cardData);
  placesWrap.prepend(createCard(cardData));

  closeModalWindow(cardFormModalWindow);
  cardForm.reset();
};

const handleExport = () => {
  exportCards(currentCards);
  importStatus.textContent = `Экспортировано карточек: ${currentCards.length}`;
};

const handleImport = async (evt) => {
  const file = evt.target.files[0];

  if (!file) {
    return;
  }

  try {
    const importedCards = await importCards(file);

    renderCards(importedCards);
    currentCards = importedCards;

    importStatus.textContent = `Импортировано карточек: ${importedCards.length}`;
  } catch (error) {
    importStatus.textContent = `Ошибка импорта: ${error.message}`;
  } finally {
    importInput.value = "";
  }
};

// Обработчики событий форм и кнопок
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;

  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

exportButton.addEventListener("click", handleExport);

importButton.addEventListener("click", () => {
  importInput.click();
});

importInput.addEventListener("change", handleImport);

const allPopups = document.querySelectorAll(".popup");
// Настраиваем обработчики закрытия попапов
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

renderCards(currentCards);
enableValidation(validationSettings);
