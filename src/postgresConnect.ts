import * as pg from 'pg';

export type ReportRow = {
    category: string;
    total_businesses: number;
    average_rating: number;
};

export class PostgresConnect {
    private readonly client = new pg.Client({
        user: 'yelp',
        host: 'localhost',
        database: 'detroitcuisine',
        password: 'password',
        port: 5432
    });

    constructor() {
        this.client.connect();
    }

    /**
     * Truncates the business_category_ratings table and then copies a CSV into it.
     */
    async copyFileIntoBusinessesTable(relativeFilename: string, columns: string) {
        try {
            await this.client.query('truncate business_category_ratings;');

            console.log('Truncated table. Starting copy to database.');
            const res = await this.client.query(
                `COPY business_category_ratings(${columns}) FROM '${relativeFilename}' with CSV;`
            );
            console.log(`Successfully copied ${res.rowCount} rows.`);
        } catch (e) {
            console.log('Error copying rows: ' + e);
        }
    }

    /**
     * Queries the business_category_ratings table for data about business ratings.
     */
    async getDetroitReport(): Promise<ReportRow[]> {
        try {
            const res = await this.client.query(
                'SELECT category, count(*) as total_businesses, avg(rating) as average_rating from business_category_ratings group by 1 order by 3 desc, 2 desc, 1;'
            );
            return res.rows;
        } catch (e) {
            console.log('Error getting report: ' + e);
            return [];
        }
    }
}
