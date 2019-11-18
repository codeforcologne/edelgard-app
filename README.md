# Edelgard app

A routing web app for the Edelgard project in Cologne, Germany

## Background

[Edelgard <sup>(de)</sup>](https://edelgard.koeln/) is a campaign by the [Cologne Initiative Against Sexualized Violence <sup>(de)</sup>](https://www.koelner-initiative-gegen-sexualisierte-gewalt.de/).
Its goal is to improve protection for women and girls against sexualized violence in public spaces within Cologne, Germany.
More than one hundred organizations and businesses in Cologne have agreed to open their doors for people seeking a protected space.

## Purpose

This app assists the user in finding available protected spaces based on geolocation and business hours.
It can then route the user to the place of their choice.

A demo version of the app can be viewed at https://edelgard-test.netlify.com/

## Development

The app currently requires an API token for the services of [Mapbox](https://www.mapbox.com/),
both for the map tiles and for routing requests.
A token can be retrieved after creating a free [Mapbox account](https://account.mapbox.com/auth/signup/).

Please create a file `.env.local` with the following contents.

```shell
REACT_APP_MAPBOX_TOKEN=yourtokenhere
```

You can then install the dependencies and start the development server.

```shell
npm install
npm start
```