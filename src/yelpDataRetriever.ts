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
    categories: { title: string; alias: string };
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
        // TODO: Hide the API key in ENV VAR or some secret key manager.
        this.graphQLClient = new GraphQLClient(this.yelpGraphQLEndpoint, {
            headers: {
                authorization: `Bearer ${process.env.YELP_API_KEY}`
            }
        });
    }

    async getDetroitBusinesses(offset: number = 0): Promise<Business[]> {
        const variables = ` { "offset": ${offset} } `;
        const data = await this.graphQLClient.request(this.ALL_DETROIT_BUSINESSES, variables);
        console.log(JSON.stringify(data, undefined, 2));
        return data.search.business;
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

new YelpDataRetriever().getDetroitBusinesses().catch((error) => console.error(error));
