CREATE DATABASE detroitcuisine;

\c detroitcuisine

CREATE USER yelp password 'password';

CREATE TABLE business_category_ratings (
    id SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL,
    category varchar(50) NOT NULL,
    rating real NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER ROLE yelp WITH SUPERUSER;
