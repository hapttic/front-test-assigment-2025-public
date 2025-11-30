<!-- Run project -->
npm i
npm run dev

<!-- Performance -->
Used useMemmo for aggregation changes.
Needs 3-4 seconds for largest dataset "Hourly" to load but only at first time
Changing aggregation and returning to "Hourly" again will load data in 1-2 seconds

