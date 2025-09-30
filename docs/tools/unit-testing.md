# Unit Testing

Unit testing is the practice of testing individual components or modules of software in isolation. This section covers the most popular unit testing frameworks and best practices.

## Popular Frameworks

### Python - pytest

pytest is the most popular Python testing framework, known for its simplicity and powerful features.

#### Installation
```bash
pip install pytest
```

#### Basic Example
```python
# test_calculator.py
import pytest

class Calculator:
    def add(self, a, b):
        return a + b
    
    def divide(self, a, b):
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero")
        return a / b

@pytest.fixture
def calculator():
    return Calculator()

def test_add(calculator):
    assert calculator.add(2, 3) == 5

def test_divide(calculator):
    assert calculator.divide(10, 2) == 5.0

def test_divide_by_zero(calculator):
    with pytest.raises(ZeroDivisionError):
        calculator.divide(10, 0)
```

#### Advanced Features
- **Fixtures**: Reusable test setup
- **Parametrized tests**: Run same test with different inputs
- **Markers**: Categorize and filter tests
- **Plugins**: Extensive ecosystem

### JavaScript - Jest

Jest is a comprehensive JavaScript testing framework developed by Meta.

#### Installation
```bash
npm install --save-dev jest
```

#### Basic Example
```javascript
// calculator.js
class Calculator {
  add(a, b) {
    return a + b;
  }
  
  divide(a, b) {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
}

module.exports = Calculator;

// calculator.test.js
const Calculator = require('./calculator');

describe('Calculator', () => {
  let calculator;
  
  beforeEach(() => {
    calculator = new Calculator();
  });
  
  test('should add two numbers', () => {
    expect(calculator.add(2, 3)).toBe(5);
  });
  
  test('should divide two numbers', () => {
    expect(calculator.divide(10, 2)).toBe(5);
  });
  
  test('should throw error when dividing by zero', () => {
    expect(() => calculator.divide(10, 0)).toThrow('Cannot divide by zero');
  });
});
```

### Java - JUnit 5

JUnit 5 is the latest version of the most popular Java testing framework.

#### Example
```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    private Calculator calculator;
    
    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }
    
    @Test
    void shouldAddTwoNumbers() {
        assertEquals(5, calculator.add(2, 3));
    }
    
    @Test
    void shouldThrowExceptionWhenDividingByZero() {
        assertThrows(ArithmeticException.class, () -> {
            calculator.divide(10, 0);
        });
    }
}
```

## Best Practices

### Test Structure

Follow the **Arrange-Act-Assert** pattern:

```python
def test_user_creation():
    # Arrange
    user_data = {"name": "John", "email": "john@example.com"}
    
    # Act
    user = User.create(user_data)
    
    # Assert
    assert user.name == "John"
    assert user.email == "john@example.com"
```

### Test Naming

Use descriptive names that explain what is being tested:

```python
# Good
def test_should_return_true_when_user_is_active():
    pass

def test_should_raise_exception_when_email_is_invalid():
    pass

# Bad
def test_user():
    pass

def test_email():
    pass
```

### Test Organization

Organize tests logically:

```
tests/
├── unit/
│   ├── models/
│   │   ├── test_user.py
│   │   └── test_product.py
│   └── services/
│       ├── test_auth_service.py
│       └── test_payment_service.py
└── integration/
    └── test_api.py
```

### Mocking and Stubbing

Use mocks to isolate units under test:

```python
from unittest.mock import Mock, patch

def test_send_email():
    # Arrange
    mock_email_service = Mock()
    user_service = UserService(email_service=mock_email_service)
    
    # Act
    user_service.register_user("john@example.com")
    
    # Assert
    mock_email_service.send_welcome_email.assert_called_once_with("john@example.com")
```

## Code Coverage

Track how much of your code is covered by tests:

### Python with coverage.py
```bash
pip install coverage
coverage run -m pytest
coverage report
coverage html  # Generate HTML report
```

### JavaScript with Jest
```json
// package.json
{
  "scripts": {
    "test": "jest --coverage"
  }
}
```

## Common Anti-Patterns

### ❌ Testing Implementation Details
```python
# Bad - testing internal method
def test_internal_calculation():
    calculator = Calculator()
    assert calculator._internal_method() == 42
```

### ❌ Tests that are too Complex
```python
# Bad - too much setup and logic
def test_complex_scenario():
    # 50 lines of setup
    # Multiple assertions
    # Complex logic in test
```

### ❌ Flaky Tests
```python
# Bad - depends on timing/external factors
def test_with_sleep():
    start_process()
    time.sleep(5)  # Unpredictable timing
    assert process_is_complete()
```

## Tools and Plugins

### Python Ecosystem
- **pytest-cov**: Coverage reporting
- **pytest-mock**: Mocking utilities
- **pytest-xdist**: Parallel test execution
- **pytest-html**: HTML test reports

### JavaScript Ecosystem
- **@testing-library**: Better testing utilities
- **enzyme**: React component testing
- **sinon**: Spies, stubs, and mocks
- **supertest**: HTTP assertion library

!!! tip "Start Small"
    Begin with simple unit tests for your core business logic, then gradually expand coverage.