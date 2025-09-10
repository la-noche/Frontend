describe('E2E - App', () => {
  it('debería mostrar la página de login por defecto', () => {
    cy.visit('/');
    cy.url().should('include', '/login');
    cy.contains('Login');
  });

  it('debería redirigir a Home después de simular login', () => {
    // Seteamos el token antes de visitar
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-jwt-token');
      },
    });

    cy.visit('/home');

    // Validamos que esté en la ruta correcta
    cy.url().should('include', '/home');

    cy.get('app-home, h1, h2, .home-container').should('exist');
  });
});
