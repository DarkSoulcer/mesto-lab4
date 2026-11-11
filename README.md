# Mesto — лабораторная работа №4, вариант 18

Интерактивная фотогалерея Mesto на нативных ES-модулях JavaScript с HTML5-валидацией форм, сборкой Vite и индивидуальным модулем импорта/экспорта карточек JSON.

## Требования
- Node.js 20.19 или выше
- NPM

## Запуск
```bash
npm install
npm run dev
```

## Сборка
```bash
npm run build
```
Результат сборки появляется в папке `dist/`.

## Вариант №18
В форме «Новое место» добавлено поле артикула с форматом `RU-1234` (`^[A-Z]{2}-\d{4}$`). Файл `src/scripts/components/dataExport.js` экспортирует текущий массив карточек в JSON и импортирует массив из выбранного JSON-файла. Для каждой карточки сохраняются `name`, `link`, `article` и `liked`. При импорте JSON проходит проверку структуры и значений.

## Структура
- `src/scripts/index.js` — инициализация и обработчики событий
- `src/scripts/components/validation.js` — переиспользуемая валидация
- `src/scripts/components/dataExport.js` — JSON-импорт и экспорт
- `src/scripts/components/card.js` — карточки
- `src/scripts/components/modal.js` — открытие и закрытие окон
- `src/scripts/cards.js` — шесть исходных карточек
