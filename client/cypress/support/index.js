const placesEndpoint = "https://edelgard-api-test.netlify.app/places.json";

const stubGeolocation = (windowObj, coords) => {
  cy.stub(windowObj.navigator.permissions, "query").callsFake(
    (permissionDesc, ...rest) => {
      if (permissionDesc.name === "geolocation") {
        return Promise.resolve({
          state: "granted",
        });
      }
      return windowObj.navigator.permissions.query(permissionDesc, ...rest);
    },
  );

  cy.stub(windowObj.navigator.geolocation, "getCurrentPosition").callsFake(
    success => {
      return success({
        coords,
      });
    },
  );
};

Cypress.Commands.add("visitWithGeolocation", (url, coords) => {
  cy.visit(url, {
    onBeforeLoad: windowObj => stubGeolocation(windowObj, coords),
  });
});

Cypress.Commands.add("stubDate", date => {
  cy.clock(date.getTime(), ["Date"]);
});

Cypress.Commands.add("stubPlaces", places => {
  // cy.route only intercepts XHR, not the Fetch API.
  // That is fine as long as we only use axios.
  cy.server();
  cy.route(placesEndpoint, places);
});

Cypress.Commands.add("confirmDisclaimer", () => {
  cy.get("[data-testid='disclaimer']")
    .should("contain", "Prototyp")
    .contains("OK")
    .click();
});

/* MAP */

// Some user interactions on the map cannot feasibly be simulated in a realiastic way.
// For these cases we get direct access to the map object from Mapbox GL.
Cypress.Commands.add("getMap", () => {
  return cy.window().its("mapboxGlMap");
});

Cypress.Commands.add("waitForMove", map => {
  return new Cypress.Promise(resolve => {
    map.on("moveend", resolve);
  });
});

Cypress.Commands.add("panTo", (map, lngLat) => {
  map.panTo(lngLat);
  cy.waitForMove(map);
});

Cypress.Commands.add("getMapCanvas", () => {
  return cy.get(".mapboxgl-canvas");
});
