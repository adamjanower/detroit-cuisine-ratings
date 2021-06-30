import { Business, YelpDataRetriever } from './yelpDataRetriever';
import { PostgresConnect, ReportRow } from './postgresConnect';
import * as fs from 'fs';

class DetroitCuisineRatings {
    private readonly yelpDataRetriever: YelpDataRetriever;
    private readonly postresConnect: PostgresConnect;
    private readonly filename: string;
    private readonly filepath: string;
    private readonly relativeFileName: string;
    private offset: number;

    constructor() {
        // TODO: Inject these
        this.yelpDataRetriever = new YelpDataRetriever();
        this.postresConnect = new PostgresConnect();
        this.filename = Date.now() + '_detroit_businesses.csv';
        this.filepath = __dirname + '/../data/';
        this.relativeFileName = this.filepath + this.filename;
        this.offset = 0;
    }

    async run() {
        await this.retriveYelpData();

        await this.postresConnect.copyFileIntoBusinessesTable(this.relativeFileName, 'name,category,rating');

        this.cleanupDataFile();

        this.outputReport(await this.postresConnect.getDetroitReport());
    }

    /**
     * This function uses the yelpDataRetriever to pull data about Detroit businesses from Yelp.
     * NOTE: There is some bug once the offset gets to 1000. I have not found it on my side and am interested if it's in Yelp's API.
     */
    private async retriveYelpData() {
        // TODO: Move this number to config.
        var num_results = 50;
        while (num_results === 50) {
            // The maximum number of results returned is 50, so we need to track the offset to pull multiples pages of results.
            var businesses: Business[] = await this.yelpDataRetriever.getDetroitBusinesses(this.offset);
            businesses.forEach(this.appendBusinessToFile.bind(this));
            num_results = businesses.length;
            this.offset += num_results;
        }
    }

    /**
     * This function parses a business into one or more lines, one for each category, and adds them into a CSV
     * @param business an object with a business name, rating, and array of categories
     */
    private appendBusinessToFile(business: Business) {
        // TODO: Move this length limit somewhere out of the code. Ideally enforced in DB.
        const name = business.name.substring(0, 50);
        const rating = business.rating;
        business.categories.forEach((category) => {
            fs.appendFile(this.relativeFileName, `"${name}","${category.title}",${rating}\n`, 'utf-8', (err) => {
                if (err) console.log(`Error appending to file: ${err}`);
            });
        });
    }

    /**
     * This function removes the CSV populated by the yelpDataRetriever
     */
    private cleanupDataFile() {
        try {
            fs.unlinkSync(this.relativeFileName);
        } catch (e) {
            console.error('Unable to clean up data file: ' + e);
        }
    }

    /**
     * This function formats and outputs the Report to STDOUT.
     * @param report an array of ReportRows
     */
    private outputReport(report: ReportRow[]) {
        console.log('Business Category\tTotal Businesses\tAverage Rating');
        report.forEach((row) => {
            console.log(`${row.category}\t${row.total_businesses}\t${row.average_rating}`);
        });
    }
}

// Entrypoint into the code
new DetroitCuisineRatings().run().then(() => {
    console.log('Execution complete');
});
