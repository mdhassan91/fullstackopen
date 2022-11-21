describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("front page can be opened", function () {
    cy.contains("Notes");
    cy.contains(
      "Note app, Department of Computer Science, University of Helsinki 2022"
    );
  });

  it("login form can be opened", function () {
    cy.contains("login").click();
  });
  it("user can login", function () {
    cy.contains("login").click();
    // cy.get('input:first').type('mluukkai')
    // cy.get('input:last').type('salainen')
    //gettting by id
    cy.get("#username").type("mluukkai");
    cy.get("#password").type("salainen");
    cy.get("#login-button").click();

    cy.contains("Matti Luukkainen logged in");
  });
  describe("when logged in", function () {
    //why we use here beforeEach because we already use that line of code above
    //No, because each test starts from zero as far as the browser is concerned.
    //check in support/commands
    //where we create command for login
    //thats why we use login
    beforeEach(function () {
      cy.login({ username: "mluukkai", password: "salainen" });
    });

    it("a new note can be created", function () {
      cy.contains("new note").click();
      cy.get("input").type("a note created by cypress");
      cy.contains("save").click();
      cy.contains("a note created by cypress");
    });

    describe("and a note exists", function () {
      beforeEach(function () {
        // cy.contains("new note").click();
        // cy.get("input").type("another note cypress");
        // cy.contains("save").click();
        cy.createNote({
          content: "another note cypress",
          important: false,
        });
      });

      describe("and some notes exists", function () {
        beforeEach(function () {
          cy.createNote({ content: "first note", important: false });
          cy.createNote({ content: "second note", important: false });
          cy.createNote({ content: "third note", important: false });
        });

        it("one of those can be made important", function () {
          //I comment below code becs if we write like this than we get error in cypress
          // cy.contains('second note')
          // cy.contains('make important').click()

          //---->Isse bhi error aa raha tha
          // cy.contains("second note").contains("make important").click();
          // cy.contains("second note").contains("make not important");

          // Yeh bhi error de raha
          // cy.contains('second note').parent().find('button').click()
          // cy.contains('second note').parent().find('button')
          //   .should('contain', 'make not important')

          // Yeh phir apan ne as se woh button koh reference le liyeh
          cy.contains("second note").parent().find("button").as("theButton");
          cy.get("@theButton").click();
          cy.get("@theButton").should("contain", "make not important");
        });
      });
      it("it can be made important", function () {

        cy.contains('another note cypress').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
     

        // cy.contains("another note cypress").contains("make not important");
      });
    });
  });

  it("login fails with wrong password", function () {
    cy.contains("login").click();
    cy.get("#username").type("mluukkai");
    cy.get("#password").type("wrong");
    cy.get("#login-button").click();
    //getting by css class in Notification
    // cy.get('.error').contains('wrong credentials')
    // using should instead of contain which is use for only text content
    // cy.get(".error").should("contain", "wrong credentials");
    // cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    // cy.get(".error").should("have.css", "border-style", "solid");

    // we can use "and" for  chaining
    cy.get(".error")
      .should("contain", "wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");
  });
});
