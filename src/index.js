import photoCard from './templates/photo-card.hbs'
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import NewsApiService from './news-api-service.js'; 
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import LoadMoreBtn from './load-more.js';

const refs = {
    searchForm: document.getElementById('search-form'),
    searchQueryInput: document.querySelector('[name="searchQuery"]'),
    buttonSubmit: document.querySelector('[type="submit"]'),
    galleryContainer: document.querySelector('.gallery'),
}

const newsApiService = new NewsApiService();
console.log(newsApiService); 

const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

refs.searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore); 

function onSearchForm(e) {
    e.preventDefault();
    newsApiService.query = refs.searchQueryInput.value.trim();

    if (newsApiService === '') {
        e.currentTarget.reset();
        onFetchError();

        loadMoreBtn.disable();
    }
    
    newsApiService.fetchPhotoCards().then(photos => {
        console.log(photos); 
         
        if (photos.hits.length === 0) {
        onFetchError();
        loadMoreBtn.hide(); 

        } else if (photos.hits.length >= 40) {
            loadMoreBtn.show();
            clearPhotosContainer();
            appendPhotosMarkup(photos);
            
            Notify.success(`Hooray! We found ${photos.totalHits} images.`);
        }
    })
    
    newsApiService.resetPage(); 
    
    e.currentTarget.reset();
    scroll();
}

async function appendPhotosMarkup(photos) {
    const markup = await photoCard(photos.hits);

    refs.galleryContainer.insertAdjacentHTML("beforeend", markup);
    if (photos.hits.length < 40 && photos.hits.length >= 1) {
         onFetchInfo();
         loadMoreBtn.hide();   
    } 
    lightbox.refresh('show.simpleLightbox');
}

function scroll() {
    let scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight
    );

    window.scrollBy({
    top: scrollHeight * -2,
    behavior: "auto",
    });
} 

function onLoadMore() {
    loadMoreBtn.disable();
    newsApiService.fetchPhotoCards().then(photos => {
        appendPhotosMarkup(photos);
        loadMoreBtn.enable(); 
    });  
}

function clearPhotosContainer() {
    refs.galleryContainer.innerHTML = '';
}

function onFetchError() {
    Report.failure(
        'Failure',
        "Sorry, there are no images matching your search query. Please try again.",
        'Okay',
    );
}  

function onFetchInfo() {
   Notify.info("We're sorry, but you've reached the end of search results.");
} 
 
var lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', 
    captionDelay: 250,
    navText: ['←','→'],
    widthRatio: 0.9,
    heightRatio: 1,
    fadeSpeed: 300,
    spinner: true,
}).refresh('show.simpleLightbox');