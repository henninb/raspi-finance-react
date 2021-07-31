describe(`payment interceptors`, () => {


  describe(`empty payment list`, () => {
    beforeEach(() => {
      cy.intercept('GET', "/payment/select", {body: []}).as('emptyList');
      cy.visit('https://hornsup:3000/payments');
      cy.wait('@emptyList');

    });

    it(`a message should be sent to describe the empty list`, () => {
    });
  });

  describe(`a list of payments`, () => {
    beforeEach(() => {
      cy.intercept('GET', "/payment/select", {fixture: 'payments.json'}).as('payments');
      cy.visit('https://hornsup:3000/payments');
      cy.wait('@payments');

      //cy.get('.network-btn').click()
    });

    it(`a message should be sent to describe the empty list`, () => {
    });
  });

});
