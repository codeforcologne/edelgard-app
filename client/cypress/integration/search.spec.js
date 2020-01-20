/// <reference types="cypress" />

import places from "../fixtures/places";
import userCoordinates from "../fixtures/userCoordinates";

const closestOpenPlace = places[1];
const secondClosestOpenPlace = places[2];

describe("Place search", () => {
  beforeEach(() => {
    cy.stubPlaces(places);
    cy.stubDate(new Date("2020-01-20T16:30:00Z"));

    cy.viewport("iphone-6+");
    cy.visitWithGeolocation("http://localhost:3000", userCoordinates);
    cy.confirmDisclaimer();
  });

  it("immediately shows the closest open place and offers additional places", () => {
    cy.contains("Schutz suchen").click().should("not.contain", "Schutz suchen");

    cy.contains(closestOpenPlace.title);
    cy.contains(closestOpenPlace.address);
    cy.contains("Geöffnet");
    cy.contains("schließt in etwa 2 Stunden");

    cy.contains("Weitere Orte").click().should("not.exist");

    cy.get("li:contains(Geöffnet):nth-of-type(2)").click();

    cy.contains(secondClosestOpenPlace.title);
  });

  it("can be closed", () => {
    cy.contains("Schutz suchen").click().should("not.contain", "Schutz suchen");

    cy.contains("Schutz suchen").should("not.exist");
    cy.contains(closestOpenPlace.title);

    cy.get("[title='Zurück zur Karte'").click();

    cy.contains("Schutz suchen");
    cy.contains(closestOpenPlace.title).should("not.exist");
  });
});
