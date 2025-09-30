# End-to-End Testing

End-to-end (E2E) testing verifies complete user workflows from start to finish, ensuring your application works correctly from the user's perspective.

## What is E2E Testing?

E2E testing simulates real user interactions with your application, testing:

- **Complete user journeys** (registration, login, checkout)
- **Cross-browser compatibility**
- **User interface functionality** 
- **Integration between all system components**
- **Performance under realistic conditions**

## Popular E2E Testing Tools

### Playwright

Modern web testing framework with excellent cross-browser support.

```javascript
// playwright.config.js
module.exports = {
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    },
    {
      name: 'firefox', 
      use: { browserName: 'firefox' }
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' }
    }
  ]
};

// test example
const { test, expect } = require('@playwright/test');

test('user registration flow', async ({ page }) => {
  // Navigate to registration page
  await page.goto('/register');
  
  // Fill registration form
  await page.fill('[data-testid="name"]', 'John Doe');
  await page.fill('[data-testid="email"]', 'john@example.com');
  await page.fill('[data-testid="password"]', 'securePassword123');
  
  // Submit form
  await page.click('[data-testid="submit"]');
  
  // Verify success
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  await expect(page).toHaveURL('/dashboard');
});
```

### Cypress

JavaScript-based testing framework with excellent developer experience.

```javascript
// cypress.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true
  }
};

// test example
describe('E-commerce checkout', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should complete purchase flow', () => {
    // Add product to cart
    cy.get('[data-cy="product-card"]').first().click();
    cy.get('[data-cy="add-to-cart"]').click();
    
    // Go to checkout
    cy.get('[data-cy="cart-icon"]').click();
    cy.get('[data-cy="checkout-btn"]').click();
    
    // Fill shipping information
    cy.get('[data-cy="shipping-name"]').type('John Doe');
    cy.get('[data-cy="shipping-address"]').type('123 Main St');
    cy.get('[data-cy="shipping-city"]').type('Anytown');
    
    // Complete payment
    cy.get('[data-cy="payment-form"]').within(() => {
      cy.get('[data-cy="card-number"]').type('4242424242424242');
      cy.get('[data-cy="expiry"]').type('12/25');
      cy.get('[data-cy="cvc"]').type('123');
    });
    
    cy.get('[data-cy="place-order"]').click();
    
    // Verify order confirmation
    cy.url().should('include', '/order-confirmation');
    cy.get('[data-cy="order-number"]').should('be.visible');
  });
});
```

### Selenium

Cross-platform automation framework supporting multiple languages.

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pytest

class TestUserLogin:
    def setup_method(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(10)
    
    def teardown_method(self):
        self.driver.quit()
    
    def test_successful_login(self):
        # Navigate to login page
        self.driver.get("https://example.com/login")
        
        # Find and fill login form
        email_field = self.driver.find_element(By.ID, "email")
        password_field = self.driver.find_element(By.ID, "password")
        login_button = self.driver.find_element(By.ID, "login-btn")
        
        email_field.send_keys("user@example.com")
        password_field.send_keys("password123")
        login_button.click()
        
        # Wait for redirect and verify
        WebDriverWait(self.driver, 10).until(
            EC.url_contains("/dashboard")
        )
        
        # Verify user is logged in
        user_menu = self.driver.find_element(By.CLASS_NAME, "user-menu")
        assert user_menu.is_displayed()
```

## Best Practices

### Page Object Model

Organize tests using the Page Object Model pattern:

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.loginButton = page.locator('[data-testid="login-btn"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }
  
  async navigate() {
    await this.page.goto('/login');
  }
  
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
  
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test('login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await loginPage.login('invalid@email.com', 'wrongpassword');
  
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toContain('Invalid credentials');
});
```

### Test Data Management

```javascript
// fixtures/testData.js
module.exports = {
  validUser: {
    email: 'test@example.com',
    password: 'validPassword123',
    name: 'Test User'
  },
  
  invalidUser: {
    email: 'invalid@email.com',
    password: 'wrongpassword'
  },
  
  products: [
    {
      name: 'Test Product 1',
      price: 29.99,
      sku: 'TEST-001'
    }
  ]
};

// Using test data
const testData = require('../fixtures/testData');

test('login with valid user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(testData.validUser.email, testData.validUser.password);
  // ... rest of test
});
```

### Environment-Specific Configuration

```javascript
// config/environments.js
const environments = {
  development: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3001/api'
  },
  staging: {
    baseUrl: 'https://staging.example.com',
    apiUrl: 'https://staging-api.example.com'
  },
  production: {
    baseUrl: 'https://example.com',
    apiUrl: 'https://api.example.com'
  }
};

const env = process.env.TEST_ENV || 'development';
module.exports = environments[env];
```

## CI/CD Integration

### GitHub Actions with Playwright

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Docker for Consistent Testing

```dockerfile
# Dockerfile.e2e
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
CMD ["npm", "run", "test:e2e"]
```

```yaml
# docker-compose.e2e.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
  
  e2e-tests:
    build:
      dockerfile: Dockerfile.e2e
    depends_on:
      - app
    environment:
      - BASE_URL=http://app:3000
    volumes:
      - ./test-results:/app/test-results
```

## Common Patterns

### Waiting Strategies

```javascript
// Good: Explicit waits
await page.waitForSelector('[data-testid="loading"]', { state: 'hidden' });
await page.waitForSelector('[data-testid="results"]', { state: 'visible' });

// Good: Wait for network requests
await Promise.all([
  page.waitForResponse('**/api/users'),
  page.click('[data-testid="load-users"]')
]);

// Avoid: Arbitrary sleeps
await page.waitForTimeout(5000); // Don't do this
```

### Error Handling

```javascript
test('handles network errors gracefully', async ({ page }) => {
  // Simulate network failure
  await page.route('**/api/**', route => route.abort());
  
  await page.goto('/dashboard');
  
  // Verify error handling
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
});
```

### Test Isolation

```javascript
test.beforeEach(async ({ page }) => {
  // Clean state before each test
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});
```

## Performance Considerations

### Parallel Execution

```javascript
// playwright.config.js
module.exports = {
  workers: process.env.CI ? 2 : undefined, // Limit workers in CI
  fullyParallel: true,
  // ... other config
};
```

### Selective Test Running

```bash
# Run only smoke tests
npx playwright test --grep="@smoke"

# Run tests for specific feature
npx playwright test tests/checkout/

# Run failed tests from previous run
npx playwright test --last-failed
```

## Debugging E2E Tests

### Visual Debugging

```javascript
// Run with headed browser
npx playwright test --headed

// Debug mode with interactive debugging
npx playwright test --debug

// Record test execution
npx playwright codegen https://example.com
```

### Screenshots and Videos

```javascript
// Automatic screenshots on failure
test('failed test example', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'failure-screenshot.png' });
  // Test that will fail...
});

// Custom video recording
await page.video().saveAs('test-recording.webm');
```

!!! warning "E2E Test Maintenance"
    E2E tests can be brittle and expensive to maintain. Focus on critical user paths and keep tests simple and focused.