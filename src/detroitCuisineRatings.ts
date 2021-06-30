import { YelpDataRetriever } from './yelpDataRetriever';

class DetroitCuisineRatings {
    private readonly yelpDataRetriever: YelpDataRetriever;

    constructor() {
        this.yelpDataRetriever = new YelpDataRetriever();
    }

    run(): void {
        this.yelpDataRetriever.getDetroitBusinesses(500);
    }
}

new DetroitCuisineRatings().run();
