/// <reference types="cypress" />

import places from "../fixtures/places";
import userCoordinates from "../fixtures/userCoordinates";

describe("Map", () => {
  beforeEach(() => {
    cy.stubPlaces(places);
    cy.stubDate(new Date("2020-01-20T16:30:00Z"));

    cy.viewport("iphone-6+");
    cy.visitWithGeolocation("http://localhost:3000", userCoordinates);
    cy.confirmDisclaimer();
  });

  it("allows selecting a place via tap, and immediately selecting a different one", () => {
    const firstPlace = places[0];
    const secondPlace = places[3];

    cy.getMap().then(map => {
      cy.panTo(map, firstPlace);

      // Cypress won't know to retry the next interaction,
      // so we need to give the map a little more time as a precaution
      cy.wait(1000);

      // desired place is now at the center of the canvas
      cy.getMapCanvas().click("center");

      cy.contains(firstPlace.title);

      cy.waitForMove(map);

      cy.panTo(map, secondPlace);
      cy.wait(1000);
      cy.getMapCanvas().click("center");
      cy.contains(secondPlace.title);

      // include final move animation in recording
      cy.waitForMove(map);
    });
  });
});
