# About
Front-end application for simplification of calculation of expenses.

# Dependencies

npm: comes together with [Node.js](https://nodejs.org/uk/) (version 22.22 or newer)

## How to run
In the project directory:
* Create file `.env` and add `REACT_APP_BASE_URL=/*path to api*/` to it.
* Run `npm i` in the terminal to update the packages.
* Run `npm start` in the terminal to start the application.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. Run `npm run lint` to check for lint errors and `npm test` to run unit tests.

## Demo data
With the API from the `Wise Split` repo running locally, `node scripts/seed-dev-data.mjs [apiBaseUrl]` creates demo users, groups and expenses. Sign in as `alicedemo` (password in the script).

## Learn More

The app is built with [Vite](https://vite.dev/guide/).

To learn React, check out the [React documentation](https://reactjs.org/).
