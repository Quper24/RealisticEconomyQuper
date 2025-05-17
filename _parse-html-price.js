const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

// URL к твоему локальному серверу, где отдаётся HTML
const url =
  "http://127.0.0.1:5501/Diesel%20prices%20around%20the%20world,%2012-May-2025%20_%20GlobalPetrolPrices.com.html";

// Путь для сохранения JSON
const outputFile = "./diesel_prices.json";

async function fetchAndParse() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Собираем названия стран
    const names = $(".graph_outside_link")
      .map((i, el) => $(el).text().trim())
      .get();

    // Собираем цены
    const prices = $(
      '#graphic [style="position: absolute; top: 2px; left: 7px; height: 15px; color: #000000;"]',
    )
      .map((i, el) => parseFloat($(el).text().trim()))
      .get();

    // Объединяем в массив объектов
    const result = names.map((name, i) => ({
      name,
      price: i < prices.length ? prices[i] : null,
    }));

    // Сохраняем в JSON
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), "utf-8");
    console.log(
      `✅ Найдено ${result.length} записей. Сохранено в ${outputFile}`,
    );
  } catch (error) {
    console.error(
      "❌ Ошибка при загрузке или парсинге страницы:",
      error.message,
    );
  }
}

fetchAndParse();
