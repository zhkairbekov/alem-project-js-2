//main.js
import { loadArticles, getFilteredAndSortedArticles, getSources, toggleDataSource, getDataSourceName } from "./data.js";
import { createArticleCard, formatDate, paginate } from './utils.js';

//Глобальные переменные
let currentPage = 1;
const articlesPerPage = 9;

//Инициализация
async function init() {
  const loaded = await loadArticles();
  if (!loaded.length) {
    document.getElementById('newsContainer').innerHTML =
      '<div class="error">Не удалось загрузить новости. Попробуйте позже.</div>';
    document.getElementById('statsText').textContent = 'Ошибка загрузки.';
    return;
  }
  populateSourceFilter();
  render();
  setupEventListeners();
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAndRender();

  const toggleBtn = document.getElementById('toggle-source');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', async () => {
      const nowUsing = toggleDataSource();
      toggleBtn.textContent = `Источник: ${getDataSourceName()}`;
      await loadAndRender();
    });

    toggleBtn.textContent = `Источник: ${getDataSourceName()}`;
  }
});

async function loadAndRender() {
  currentPage = 1; //сбрасываем на первую страницу
  await loadArticles(); //загружаем данные
  clearSourceFilter(); //сброс фильтра (если нужно)
  populateSourceFilter(); //заново заполняем
  render(); //полноценная перерисовка (и пагинация тоже)
}

function clearSourceFilter() {
  const sourceFilter = document.getElementById('sourceFilter');
  while (sourceFilter.options.length > 1) {
    sourceFilter.remove(1); //удаляем всё, кроме первого "Все источники"
  }
}

//Заполнить фильтр источников
function populateSourceFilter() {
  const sourceFilter = document.getElementById('sourceFilter');
  getSources().forEach(source => {
    const option = document.createElement('option');
    option.value = source;
    option.textContent = source;
    sourceFilter.appendChild(option);
  });
}

//Применить фильтры, отрисовать
function render() {
  const search = document.getElementById('searchInput').value;
  const sort = document.getElementById('sortSelect').value;
  const source = document.getElementById('sourceFilter').value;

  const allFiltered = getFilteredAndSortedArticles({ search, sort, source });
  const articlesToShow = paginate(allFiltered, currentPage, articlesPerPage);

  renderArticles(articlesToShow);
  updateStats(allFiltered.length);
  renderPagination(allFiltered.length);
}

//Отрисовка карточек
function renderArticles(articles) {
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = '';
  if (!articles.length) {
    newsContainer.innerHTML = '<div class="no-results">Нет результатов по вашему запросу.</div>';
    return;
  }
  articles.forEach(article => {
    newsContainer.appendChild(createArticleCard(article, openModal));
  });
}

//Обновить статистику
function updateStats(count) {
  document.getElementById('statsText').textContent = `Найдено ${count} новостей.`;
  const totalPages = Math.ceil(count / articlesPerPage);
  document.getElementById('pageInfo').textContent = `Страница ${currentPage} из ${totalPages}`;
}

//Отрисовать пагинацию
function renderPagination(totalItems) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const totalPages = Math.ceil(totalItems / articlesPerPage);

  const prev = document.createElement('button');
  prev.textContent = '← Назад';
  prev.disabled = currentPage === 1;
  prev.addEventListener('click', () => {
    currentPage--;
    render();
  });
  pagination.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentPage = i;
      render();
    });
    pagination.appendChild(btn);
  }

  const next = document.createElement('button');
  next.textContent = 'Вперед →';
  next.disabled = currentPage === totalPages;
  next.addEventListener('click', () => {
    currentPage++;
    render();
  });
  pagination.appendChild(next);

  pagination.style.display = totalPages > 1 ? 'flex' : 'none';
}

//Модальное окно
function openModal(article) {
  document.getElementById('modalImage').src = article.image_url;
  document.getElementById('modalTitle').textContent = article.title;
  document.getElementById('modalSource').textContent = article.news_site;
  document.getElementById('modalDate').textContent = formatDate(article.published_at);
  document.getElementById('modalSummary').textContent = article.content;
  document.getElementById('modalLink').href = article.url;
  document.getElementById('modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.body.style.overflow = '';
}

//Слушатели
function setupEventListeners() {
  document.getElementById('searchInput').addEventListener('input', () => {
    currentPage = 1;
    render();
  });
  document.getElementById('sortSelect').addEventListener('change', () => {
    currentPage = 1;
    render();
  });
  document.getElementById('sourceFilter').addEventListener('change', () => {
    currentPage = 1;
    render();
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });
}

//Запуск
window.onload = init;
