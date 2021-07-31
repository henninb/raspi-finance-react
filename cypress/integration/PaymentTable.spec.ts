describe(`payment interceptors`, () => {
  beforeEach( () => {
    cy.intercept('GET', "/payment/select", {body: []}).as('emptyList');
    cy.visit('https://hornsup:3000/payments');
    cy.wait('@emptyList');

    //cy.get('.network-btn').click()
  });

  it(`a message should be sent`, () => {
  });
});
