# Integration Testing

Integration testing focuses on verifying that different components of your application work correctly together. This section covers tools and strategies for effective integration testing.

## What is Integration Testing?

Integration testing sits between unit tests and end-to-end tests, focusing on:

- **API endpoints and responses**
- **Database interactions**
- **Service-to-service communication**  
- **Third-party integrations**
- **Component interfaces**

## Types of Integration Testing

### API Testing

Testing REST APIs, GraphQL endpoints, and other web services.

#### Tools for API Testing

| Tool | Strengths | Best For |
|------|-----------|----------|
| Postman | GUI, Collections, Environments | Manual testing, Documentation |
| REST Assured | Java integration, BDD syntax | Java applications |
| Requests + pytest | Python ecosystem, Flexible | Python applications |
| Supertest | Node.js integration | JavaScript/Node.js apps |

#### Example with Python + Requests

```python
import requests
import pytest

@pytest.fixture
def api_client():
    return requests.Session()

def test_create_user(api_client):
    # Arrange
    user_data = {
        "name": "John Doe",
        "email": "john@example.com"
    }
    
    # Act
    response = api_client.post("/api/users", json=user_data)
    
    # Assert
    assert response.status_code == 201
    assert response.json()["email"] == "john@example.com"
    assert "id" in response.json()

def test_get_user(api_client):
    # First create a user
    user_data = {"name": "Jane Doe", "email": "jane@example.com"}
    create_response = api_client.post("/api/users", json=user_data)
    user_id = create_response.json()["id"]
    
    # Then retrieve it
    response = api_client.get(f"/api/users/{user_id}")
    
    assert response.status_code == 200
    assert response.json()["name"] == "Jane Doe"
```

### Database Testing

Testing database operations and data persistence.

#### TestContainers Approach

```python
import pytest
from testcontainers.postgres import PostgresContainer
import psycopg2

@pytest.fixture(scope="session")
def postgres_container():
    with PostgresContainer("postgres:13") as postgres:
        yield postgres

@pytest.fixture
def db_connection(postgres_container):
    connection = psycopg2.connect(postgres_container.get_connection_url())
    yield connection
    connection.close()

def test_user_repository(db_connection):
    # Setup database schema
    cursor = db_connection.cursor()
    cursor.execute("""
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE
        )
    """)
    
    # Test repository
    repo = UserRepository(db_connection)
    user = repo.create_user("John Doe", "john@example.com")
    
    assert user.id is not None
    assert user.name == "John Doe"
    
    # Verify in database
    cursor.execute("SELECT * FROM users WHERE id = %s", (user.id,))
    db_user = cursor.fetchone()
    assert db_user[1] == "John Doe"  # name
    assert db_user[2] == "john@example.com"  # email
```

### Service Integration

Testing interactions between microservices.

#### WireMock for Service Mocking

```python
import requests
import json
from wiremock import WireMock

def test_payment_service_integration():
    # Setup WireMock
    wiremock = WireMock("localhost", 8080)
    
    # Mock payment gateway response
    wiremock.stub_for({
        "request": {
            "method": "POST",
            "url": "/payments"
        },
        "response": {
            "status": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "transaction_id": "txn_123456",
                "status": "completed"
            })
        }
    })
    
    # Test the service
    payment_service = PaymentService("http://localhost:8080")
    result = payment_service.process_payment(100.0, "USD")
    
    assert result.transaction_id == "txn_123456"
    assert result.status == "completed"
```

## Best Practices

### Test Data Management

```python
@pytest.fixture
def clean_database():
    """Ensure clean state for each test"""
    # Setup: Create fresh test data
    db.create_all()
    yield
    # Teardown: Clean up after test
    db.drop_all()

@pytest.fixture
def sample_users():
    """Provide consistent test data"""
    return [
        {"name": "Alice", "email": "alice@example.com"},
        {"name": "Bob", "email": "bob@example.com"}
    ]
```

### Environment Configuration

```python
# config.py
import os

class TestConfig:
    DATABASE_URL = os.getenv('TEST_DATABASE_URL', 'sqlite:///:memory:')
    API_BASE_URL = os.getenv('TEST_API_BASE_URL', 'http://localhost:5000')
    EXTERNAL_SERVICE_URL = os.getenv('MOCK_SERVICE_URL', 'http://localhost:8080')
```

### Error Handling Tests

```python
def test_api_error_handling(api_client):
    # Test 404 error
    response = api_client.get("/api/users/nonexistent")
    assert response.status_code == 404
    assert "error" in response.json()
    
    # Test validation error
    invalid_data = {"email": "invalid-email"}
    response = api_client.post("/api/users", json=invalid_data)
    assert response.status_code == 400
    assert "validation" in response.json()["error"]
```

## Tools and Frameworks

### Python Ecosystem

```python
# requirements.txt for Python integration testing
pytest>=7.0.0
requests>=2.28.0
testcontainers>=3.7.0
wiremock>=2.5.0
pytest-xdist>=3.0.2  # Parallel execution
pytest-mock>=3.10.0  # Mocking utilities
```

### JavaScript/Node.js

```javascript
// Example with Supertest and Jest
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  test('POST /api/users creates a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);
    
    expect(response.body.email).toBe('john@example.com');
    expect(response.body.id).toBeDefined();
  });
});
```

### Java with REST Assured

```java
import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

class UserApiTest {
    
    @Test
    void shouldCreateUser() {
        given()
            .contentType("application/json")
            .body("{'name': 'John Doe', 'email': 'john@example.com'}")
        .when()
            .post("/api/users")
        .then()
            .statusCode(201)
            .body("email", equalTo("john@example.com"))
            .body("id", notNullValue());
    }
}
```

## CI/CD Integration

### Docker Compose for Testing

```yaml
# docker-compose.test.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - DATABASE_URL=postgresql://test:test@db:5432/testdb
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: testdb
  
  tests:
    build: .
    command: pytest tests/integration/
    depends_on:
      - app
      - db
```

### GitHub Actions Example

```yaml
name: Integration Tests
on: [push, pull_request]

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Run integration tests
        run: pytest tests/integration/
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres
```

## Common Patterns

### Test Isolation

```python
import pytest
from contextlib import contextmanager

@contextmanager
def isolated_test():
    """Ensure each test runs in isolation"""
    # Begin transaction
    db.begin()
    try:
        yield
    finally:
        # Always rollback, never commit
        db.rollback()

def test_user_creation():
    with isolated_test():
        user = create_user("John", "john@example.com")
        assert user.id is not None
        # Changes are automatically rolled back
```

### Contract Testing

```python
def test_external_api_contract():
    """Verify external API still matches our expectations"""
    response = requests.get("https://api.external-service.com/health")
    
    # Verify contract
    assert response.status_code == 200
    assert "version" in response.json()
    assert "status" in response.json()
    
    # Verify expected fields are present
    required_fields = ["timestamp", "uptime", "services"]
    for field in required_fields:
        assert field in response.json()
```

!!! tip "Start Small"
    Begin with testing your most critical integration points, then expand coverage gradually.