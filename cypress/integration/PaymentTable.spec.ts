describe(`payment interceptors`, () => {
  describe(`empty payment list`, () => {
    beforeEach(() => {
      cy.intercept("GET", "/payment/select", { body: [] }).as("emptyList");
      cy.visit("/payments");
      cy.wait("@emptyList");
    });

    it(`a message should be sent to describe the empty list`, () => {
      cy.get(`[data-test-id=payments-link]`).should("exist");
      cy.get(`[data-test-id=freeform-link]`).should("exist");
      cy.get(`[data-test-id=payment-required-link]`).should("exist");
      cy.get(`[data-test-id="payments-table"]`).should("exist");
    });
  });

  describe(`a list of payments`, () => {
    beforeEach(() => {
      cy.intercept("POST", "/payment/insert", {
        fixture: "payment-insert.json",
      }).as("payment-insert");
      cy.intercept("GET", "/payment/select", { fixture: "payments.json" }).as(
        "payments"
      );

      cy.intercept("GET", "/account/select/active", {
        fixture: "accounts.json",
      }).as("accounts");

      cy.visit("/payments");
      cy.wait("@payments");
    });

    it(`a message should be sent to describe the empty list`, () => {
      cy.get(`[data-test-id="payments-table"]`).should("exist");

      // cy.get('div > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .material-icons').click();
      // cy.get('.react-datepicker__input-container > input').click();
      // cy.get(':nth-child(1) > .react-datepicker__day--003').click();
      // cy.get('.css-yk16xz-control > .css-g1d714-ValueContainer > .css-1wa3eu0-placeholder').click();
      // //cy.get('#react-select-4-option-1').click();
      // cy.get(':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').clear();
      // cy.get(':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type('0.0');
      // cy.get(':nth-child(4) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').click();
      // cy.get('[aria-describedby="mui-91950"] > .MuiIconButton-label > .material-icons').click();
      // /* ==== End Cypress Studio ==== */
      /* ==== Generated with Cypress Studio ==== */
      cy.get(
        "div > :nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .material-icons"
      ).click();
      cy.get(".react-datepicker__input-container > input").click();
      cy.get(":nth-child(1) > .react-datepicker__day--003").click();
      cy.get(".react-datepicker__input-container > input").click();

      cy.get(
        ".css-yk16xz-control > .css-g1d714-ValueContainer > .css-1wa3eu0-placeholder"
      );

      //.click();

      //cy.get('#react-select-0-option-1').click();

      // cy.get('.css-10nd86i input').eq(1) // get the first react-select input
      //     .focus() // workaround for bug #2
      //     .type('chase_brian', {force:true})

      //cy.get(':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').clear();
      //cy.get(':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type('chase_brian');
      cy.get(
        ":nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
      ).clear();
      cy.get(
        ":nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
      ).type("0.0");
      cy.get(
        ":nth-child(4) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
      ).clear();
      cy.get(
        ":nth-child(4) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
      ).type("bcu-checking_brian");
      cy.get(
        "div > :nth-child(1) > .MuiIconButton-label > .material-icons"
      ).click();
      /* ==== End Cypress Studio ==== */
    });
  });
});
