(() => {
  const storageKey = "obaitech-language";
  const fields = [
    ["data-copy", "textContent"],
    ["data-label", "aria-label"]
  ].flatMap(([attribute, property]) =>
    Array.from(document.querySelectorAll(`[${attribute}]`), element => ({
      element, property, key: element.getAttribute(attribute),
      english: property === "textContent" ? element.textContent : element.getAttribute(property)
    }))
  );
  const buttons = [...document.querySelectorAll("[data-language]")];
  const description = document.querySelector('meta[name="description"]');
  const englishDescription = description.content;

  function render(language) {
    const arabic = language === "ar";
    document.documentElement.lang = language;
    document.documentElement.dir = arabic ? "rtl" : "ltr";
    document.title = arabic ? "ObaiTech — أبي وتد" : "ObaiTech — Obai Wattad";
    description.content = arabic
      ? "أعمال أبي وتد في تصميم وتطوير المواقع والمتاجر الإلكترونية وتطبيقات الهاتف."
      : englishDescription;
    for (const field of fields) {
      const value = arabic ? obaiArabic[field.key] : field.english;
      if (field.property === "textContent") field.element.textContent = value;
      else field.element.setAttribute(field.property, value);
    }
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
    }
    document.querySelector("#shiny .text-link").href = arabic
      ? "https://shiny-store.pages.dev/?lang=ar" : "https://shiny-store.pages.dev/?lang=en";
  }

  function selectLanguage(language) {
    render(language);
    try { localStorage.setItem(storageKey, language); } catch { /* The switch still works for this visit. */ }
  }

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const language = button.dataset.language;
      selectLanguage(language);
      const url = new URL(location.href);
      if (url.searchParams.has("lang")) {
        url.searchParams.set("lang", language);
        history.replaceState(history.state, "", url);
      }
    });
  }

  const requestedLanguage = new URLSearchParams(location.search).get("lang");
  if (requestedLanguage === "ar" || requestedLanguage === "en") {
    selectLanguage(requestedLanguage);
  } else {
    try {
      if (localStorage.getItem(storageKey) === "ar") render("ar");
    } catch { /* English is already present in the HTML. */ }
  }
})();
