# API Reference

This section provides detailed API documentation and reference materials for the Hands testing tools and utilities.

## Core APIs

### Test Runner API

The Test Runner API provides programmatic access to test execution and reporting.

#### TestRunner Class

```python
class TestRunner:
    """Main test runner for executing test suites."""
    
    def __init__(self, config: TestConfig):
        """Initialize the test runner with configuration.
        
        Args:
            config: Test configuration object containing settings
        """
        self.config = config
        self.results = []
    
    def run_suite(self, test_suite: TestSuite) -> TestResults:
        """Execute a test suite and return results.
        
        Args:
            test_suite: The test suite to execute
            
        Returns:
            TestResults: Detailed results of test execution
            
        Raises:
            TestExecutionError: If test execution fails
        """
        pass
    
    def run_parallel(self, test_suites: List[TestSuite], 
                    workers: int = 4) -> List[TestResults]:
        """Execute multiple test suites in parallel.
        
        Args:
            test_suites: List of test suites to execute
            workers: Number of parallel workers (default: 4)
            
        Returns:
            List[TestResults]: Results from all test suites
        """
        pass
```

#### Configuration API

```python
@dataclass
class TestConfig:
    """Configuration for test execution."""
    
    # Execution settings
    timeout: int = 300  # Test timeout in seconds
    retry_count: int = 3  # Number of retries for flaky tests
    parallel_workers: int = 4  # Number of parallel execution workers
    
    # Output settings
    output_format: str = "json"  # Output format: json, xml, html
    report_path: str = "./test-reports"  # Path for test reports
    verbose: bool = False  # Enable verbose output
    
    # Environment settings
    environment: str = "test"  # Test environment
    base_url: str = ""  # Base URL for API tests
    database_url: str = ""  # Database connection for integration tests
    
    def validate(self) -> bool:
        """Validate configuration settings."""
        if self.timeout <= 0:
            raise ValueError("Timeout must be positive")
        if self.retry_count < 0:
            raise ValueError("Retry count cannot be negative")
        return True
```

### Assert Utilities

Enhanced assertion utilities for comprehensive testing.

```python
class AssertUtils:
    """Enhanced assertion utilities."""
    
    @staticmethod
    def assert_api_response(response: Response, 
                          expected_status: int = 200,
                          expected_schema: dict = None):
        """Assert API response meets expectations.
        
        Args:
            response: HTTP response object
            expected_status: Expected HTTP status code
            expected_schema: JSON schema for response validation
        """
        assert response.status_code == expected_status, \
            f"Expected status {expected_status}, got {response.status_code}"
        
        if expected_schema:
            jsonschema.validate(response.json(), expected_schema)
    
    @staticmethod
    def assert_database_state(connection, table: str, 
                            expected_count: int = None,
                            conditions: dict = None):
        """Assert database state matches expectations.
        
        Args:
            connection: Database connection
            table: Table name to check
            expected_count: Expected number of records
            conditions: Conditions for filtering records
        """
        cursor = connection.cursor()
        
        if conditions:
            where_clause = " AND ".join([f"{k} = %s" for k in conditions.keys()])
            query = f"SELECT COUNT(*) FROM {table} WHERE {where_clause}"
            cursor.execute(query, list(conditions.values()))
        else:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
        
        actual_count = cursor.fetchone()[0]
        
        if expected_count is not None:
            assert actual_count == expected_count, \
                f"Expected {expected_count} records, found {actual_count}"
```

### Test Data Factory

Factory pattern for generating test data.

```python
class TestDataFactory:
    """Factory for generating test data."""
    
    @staticmethod
    def create_user(name: str = None, email: str = None, **kwargs) -> dict:
        """Create user test data.
        
        Args:
            name: User name (auto-generated if None)
            email: User email (auto-generated if None)
            **kwargs: Additional user properties
            
        Returns:
            dict: User data dictionary
        """
        from faker import Faker
        fake = Faker()
        
        return {
            "name": name or fake.name(),
            "email": email or fake.email(),
            "created_at": fake.date_time_this_year().isoformat(),
            **kwargs
        }
    
    @staticmethod
    def create_product(name: str = None, price: float = None, **kwargs) -> dict:
        """Create product test data."""
        from faker import Faker
        fake = Faker()
        
        return {
            "name": name or fake.catch_phrase(),
            "price": price or round(fake.random.uniform(10.0, 1000.0), 2),
            "category": fake.word(),
            "sku": fake.uuid4(),
            **kwargs
        }
```

## REST API Endpoints

### Health Check

```http
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-09-30T10:00:00Z",
  "version": "2025.0.1",
  "services": {
    "database": "healthy",
    "cache": "healthy"
  }
}
```

### Test Execution

```http
POST /api/tests/run
Content-Type: application/json

{
  "suite_name": "integration_tests",
  "environment": "staging",
  "parallel": true,
  "filters": {
    "tags": ["api", "critical"],
    "exclude_tags": ["slow"]
  }
}
```

Response:
```json
{
  "execution_id": "exec_12345",
  "status": "running",
  "started_at": "2025-09-30T10:00:00Z",
  "estimated_duration": 300
}
```

### Test Results

```http
GET /api/tests/results/{execution_id}
```

Response:
```json
{
  "execution_id": "exec_12345",
  "status": "completed",
  "started_at": "2025-09-30T10:00:00Z",
  "completed_at": "2025-09-30T10:05:00Z",
  "duration": 300,
  "summary": {
    "total": 150,
    "passed": 145,
    "failed": 3,
    "skipped": 2,
    "success_rate": 96.67
  },
  "failures": [
    {
      "test_name": "test_payment_processing",
      "error": "AssertionError: Expected 200, got 500",
      "traceback": "...",
      "duration": 5.2
    }
  ]
}
```

## Error Codes

### Test Execution Errors

| Code | Name | Description |
|------|------|-------------|
| `T001` | `TestTimeoutError` | Test execution exceeded timeout |
| `T002` | `TestConfigError` | Invalid test configuration |
| `T003` | `TestDependencyError` | Missing test dependency |
| `T004` | `TestEnvironmentError` | Test environment not available |

### API Errors

| Code | Name | Description |
|------|------|-------------|
| `A001` | `InvalidRequestError` | Malformed request payload |
| `A002` | `AuthenticationError` | Invalid or missing authentication |
| `A003` | `RateLimitError` | Too many requests |
| `A004` | `ResourceNotFoundError` | Requested resource not found |

## Configuration Schema

### Test Configuration File

```yaml
# test-config.yml
execution:
  timeout: 300
  retry_count: 3
  parallel_workers: 4
  fail_fast: false

reporting:
  format: ["json", "html"]
  output_path: "./test-reports"
  include_logs: true
  capture_screenshots: true

environment:
  name: "staging"
  base_url: "https://staging.example.com"
  database_url: "postgresql://test:test@localhost:5432/testdb"
  
filters:
  include_tags: ["smoke", "regression"]
  exclude_tags: ["manual", "slow"]
  test_patterns: ["test_*.py", "*_test.py"]

notifications:
  slack:
    webhook_url: "https://hooks.slack.com/..."
    channel: "#test-results"
  email:
    recipients: ["team@example.com"]
    on_failure_only: true
```

### JSON Schema for Test Results

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "execution_id": {"type": "string"},
    "status": {"enum": ["running", "completed", "failed", "cancelled"]},
    "started_at": {"type": "string", "format": "date-time"},
    "completed_at": {"type": "string", "format": "date-time"},
    "duration": {"type": "number"},
    "summary": {
      "type": "object",
      "properties": {
        "total": {"type": "integer"},
        "passed": {"type": "integer"},
        "failed": {"type": "integer"},
        "skipped": {"type": "integer"},
        "success_rate": {"type": "number"}
      },
      "required": ["total", "passed", "failed", "skipped"]
    },
    "tests": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "status": {"enum": ["passed", "failed", "skipped"]},
          "duration": {"type": "number"},
          "error": {"type": "string"},
          "traceback": {"type": "string"}
        },
        "required": ["name", "status"]
      }
    }
  },
  "required": ["execution_id", "status", "started_at", "summary"]
}
```

## SDK Examples

### Python SDK

```python
from hands import TestRunner, TestConfig, AssertUtils

# Initialize configuration
config = TestConfig(
    timeout=300,
    parallel_workers=4,
    environment="staging"
)

# Create test runner
runner = TestRunner(config)

# Run tests
results = runner.run_suite("integration_tests")

# Check results
if results.success_rate < 95:
    print(f"Test suite failed with {results.success_rate}% success rate")
    for failure in results.failures:
        print(f"Failed: {failure.test_name} - {failure.error}")
```

### JavaScript SDK

```javascript
const { TestRunner, TestConfig } = require('@hands/testing-tools');

// Configure test runner
const config = new TestConfig({
  timeout: 300000,
  parallelWorkers: 4,
  environment: 'staging'
});

// Initialize runner
const runner = new TestRunner(config);

// Execute tests
async function runTests() {
  try {
    const results = await runner.runSuite('integration_tests');
    
    if (results.successRate < 95) {
      console.error(`Tests failed with ${results.successRate}% success rate`);
      results.failures.forEach(failure => {
        console.error(`Failed: ${failure.testName} - ${failure.error}`);
      });
    }
  } catch (error) {
    console.error('Test execution failed:', error);
  }
}

runTests();
```

## Rate Limits

| Endpoint | Rate Limit | Window |
|----------|------------|---------|
| `/api/health` | 100 requests | 1 minute |
| `/api/tests/run` | 10 requests | 1 minute |
| `/api/tests/results/*` | 1000 requests | 1 minute |

## Versioning

The API uses semantic versioning (SemVer). The current version is `v1`.

- **Major version** changes indicate breaking changes
- **Minor version** changes add new features without breaking existing functionality  
- **Patch version** changes include bug fixes and small improvements

API versions are specified in the URL path: `/api/v1/tests/run`

!!! note "Deprecation Policy"
    Deprecated API versions will be supported for at least 12 months after the new version is released, with advance notice provided to users.