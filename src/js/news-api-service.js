import axios from "axios";

const API_KEY = '24760399-090abf7dadf4273caa09f36f4';
const BASE_URL = 'https://pixabay.com/api/';

export default class  NewsApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }

    async fetchPhotoCards() {
       
        const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`;
        
        try {
            const response = await axios.get(url);
            const data = response.data; 
            this.incrementPage();
            return data;
              
        } catch (error) {
            console.log(error);
        } 
        
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
        
    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
