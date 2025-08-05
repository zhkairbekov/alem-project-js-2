//utils.js

//Форматирование даты
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

//Разбивка на страницы
export function paginate(items, page, perPage) {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

//Создание DOM-элемента статьи
export function createArticleCard(article, onClick) {
  const card = document.createElement('div');
  card.className = 'news-card';
  card.innerHTML = `
    <img class="card-image" src="${article.image_url}" alt="${article.title}">
    <div class="card-content">
      <h3 class="card-title">${article.title}</h3>
      <div class="card-meta">
        <span class="card-source">${article.news_site}</span>
        <span>${formatDate(article.published_at)}</span>
      </div>
      <p class="card-summary">${truncateText(article.summary, 80)}</p>
    </div>
  `;
  card.addEventListener('click', () => onClick(article));
  return card;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
