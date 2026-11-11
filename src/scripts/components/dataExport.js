
const articlePattern = /^[A-Z]{2}-\d{4}$/;

export const exportCards = (cards) => {
  const json = JSON.stringify(cards, null, 2);

  const blob = new Blob([json], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "mesto-cards.json";

  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const importCards = async (file) => {
  const text = await file.text();
  const cards = JSON.parse(text);

  if (!Array.isArray(cards)) {
    throw new Error("JSON должен содержать массив карточек");
  }

  return cards.map((card, index) => {
    const { name, link, article = null, liked = false } = card ?? {};

    if (
      typeof name !== "string" ||
      !/^[a-zA-Zа-яА-ЯёЁ\s-]{2,30}$/.test(name)
    ) {
      throw new Error(`Неверное название карточки №${index + 1}`);
    }

    if (typeof link !== "string") {
      throw new Error(`Неверная ссылка карточки №${index + 1}`);
    }

    try {
      const url = new URL(link);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Неподдерживаемый протокол");
      }
    } catch {
      throw new Error(`Неверный URL карточки №${index + 1}`);
    }

    if (
      article !== null &&
      (typeof article !== "string" || !articlePattern.test(article))
    ) {
      throw new Error(`Неверный артикул карточки №${index + 1}`);
    }

    if (typeof liked !== "boolean") {
      throw new Error(`Неверное состояние лайка карточки №${index + 1}`);
    }

    return { name, link, article, liked };
  });
};
