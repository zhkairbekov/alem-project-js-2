//data.js
import { rawData } from './rawData.js';

export let allArticles = [];
export let filteredArticles = [];
let useAPI = false;

export function toggleDataSource() {
    useAPI = !useAPI;
    return useAPI;
}

export function getDataSourceName() {
    return useAPI ? 'API' : 'Local';
}

export async function loadArticles() {
    if (!useAPI) {
        allArticles = rawData;
        filteredArticles = [...allArticles];
        return allArticles;
    }

    try {
        const response = await fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=100');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const json = await response.json();

        if (Array.isArray(json.results)) {
            allArticles = json.results;
        } else if (Array.isArray(json)) {
            allArticles = json;
        } else {
            console.error('Unexpected data structure from API:', json);
            allArticles = [];
        }

        filteredArticles = [...allArticles];
        return allArticles;
    } catch (error) {
        console.error('Ошибка при загрузке статей из API:', error);
        return [];
    }
}

//Фильтрация и сортировка
export function getFilteredAndSortedArticles({ search = '', sort = 'date-desc', source = '' }) {
    filteredArticles = allArticles.filter(article => {
        const matchesSearch =
            article.title.toLowerCase().includes(search.toLowerCase()) ||
            article.summary.toLowerCase().includes(search.toLowerCase());
        const matchesSource = source ? article.news_site === source : true;
        return matchesSearch && matchesSource;
    });

    switch (sort) {
        case 'date-desc':
            filteredArticles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
            break;
        case 'date-asc':
            filteredArticles.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
            break;
        case 'title-asc':
            filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            filteredArticles.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }

    return filteredArticles;
}

//Получить список источников
export function getSources() {
    return [...new Set(allArticles.map(article => article.news_site))];
}