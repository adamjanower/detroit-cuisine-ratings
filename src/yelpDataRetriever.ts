import { GraphQLClient, gql } from 'graphql-request';
import * as dotenv from 'dotenv';

export type BusinessList = {
    search: {
        business: Business[];
    };
};

export type Business = {
    name: String;
    rating: number;
    categories: { title: string; alias: string }[];
};

/**
 * This class is responsible for communicating with Yelp APIs and retrieving the desired data.
 */
export class YelpDataRetriever {
    // TODO inject?
    private readonly yelpGraphQLEndpoint = 'https://api.yelp.com/v3/graphql';
    private readonly graphQLClient: GraphQLClient;

    constructor() {
        // TODO: More robust config handling. Move to encapsulated class.
        dotenv.config();
        this.graphQLClient = new GraphQLClient(this.yelpGraphQLEndpoint, {
            headers: {
                authorization: `Bearer ${process.env.YELP_API_KEY}`
            }
        });
    }

    /**
     * This function asks Yelp for 50 business from Detroit, their name, categories, and ratings.
     * @param offset The number of results to 'skip' when asking Yelp for more businesses.
     * @returns Business[], max length of 50.
     */
    async getDetroitBusinesses(offset: number = 0): Promise<Business[]> {
        const variables = ` { "offset": ${offset} } `;
        try {
            const data = await this.graphQLClient.request(this.ALL_DETROIT_BUSINESSES, variables);
            console.log(`Retrieved ${data.search.business.length} businesses.`);
            return data.search.business;
        } catch (e) {
            // TODO: I don't love this error handling. Is there a simpler way to catch this promise failure? Would then/catch be better?
            console.log(`Error retrieving batch of data. Offset: ${offset}, Error: ${e}`);
            return [];
        }
    }

    ALL_DETROIT_BUSINESSES: string = gql`
        query ($offset: Int = 0) {
            search(location: "detroit, mi", limit: 50, offset: $offset) {
                business {
                    name
                    rating
                    categories {
                        title
                        alias
                    }
                }
            }
        }
    `;
}
