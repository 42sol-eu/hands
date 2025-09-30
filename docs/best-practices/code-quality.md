# Code Quality

Maintaining high code quality is essential for sustainable software development. This section covers tools, practices, and metrics for ensuring code quality in your projects.

## Code Quality Dimensions

### 1. Correctness
- Code works as intended
- Handles edge cases properly
- Passes all tests

### 2. Readability
- Clear and understandable code
- Consistent formatting
- Good naming conventions

### 3. Maintainability
- Easy to modify and extend
- Well-structured and organized
- Minimal technical debt

### 4. Performance
- Efficient algorithms and data structures
- Optimized resource usage
- Acceptable response times

## Static Analysis Tools

### Python - Pylint, Black, mypy

```bash
# Install tools
pip install pylint black mypy isort

# Linting
pylint mymodule.py

# Code formatting
black .

# Type checking
mypy mymodule.py

# Import sorting
isort .
```

Configuration example:
```ini
# pyproject.toml
[tool.black]
line-length = 88
target-version = ['py39']

[tool.isort]
profile = "black"
multi_line_output = 3

[tool.pylint.messages_control]
disable = "C0330, C0326"

[tool.mypy]
python_version = "3.9"
warn_return_any = true
warn_unused_configs = true
```

### JavaScript - ESLint, Prettier

```bash
# Install tools
npm install --save-dev eslint prettier

# Linting
npx eslint src/

# Formatting
npx prettier --write src/
```

Configuration:
```json
// .eslintrc.json
{
  "extends": ["eslint:recommended", "@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error"
  }
}

// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## Code Review Process

### Review Checklist

#### Functionality
- [ ] Code solves the intended problem
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Performance is acceptable

#### Design
- [ ] Code follows established patterns
- [ ] Abstractions are appropriate
- [ ] Dependencies are minimal
- [ ] SOLID principles are followed

#### Style
- [ ] Naming is clear and consistent
- [ ] Code is properly formatted
- [ ] Comments explain "why" not "what"
- [ ] No dead or commented-out code

#### Testing
- [ ] New functionality has tests
- [ ] Tests cover edge cases
- [ ] Tests are reliable and fast
- [ ] Test names are descriptive

### Review Guidelines

```markdown
## Code Review Guidelines

### For Authors
1. Keep pull requests small and focused
2. Write clear commit messages
3. Add comprehensive tests
4. Update documentation
5. Self-review before submitting

### For Reviewers  
1. Be constructive and specific
2. Focus on important issues first
3. Suggest improvements, don't just criticize
4. Ask questions to understand context
5. Acknowledge good code

### Example Review Comments

Good:
> "Consider extracting this logic into a separate method to improve readability and reusability."

> "This looks great! The error handling is comprehensive."

Avoid:
> "This is wrong."
> "Bad code."
```

## Metrics and Monitoring

### Key Quality Metrics

| Metric | Description | Target |
|--------|-------------|---------|
| Code Coverage | % of code covered by tests | > 80% |
| Cyclomatic Complexity | Code complexity measure | < 10 per method |
| Technical Debt Ratio | Time to fix vs develop | < 5% |
| Duplicate Code | % of duplicated code | < 3% |
| Maintainability Index | Ease of maintenance (0-100) | > 60 |

### SonarQube Integration

```yaml
# sonar-project.properties
sonar.projectKey=my-project
sonar.projectName=My Project
sonar.projectVersion=1.0
sonar.sources=src
sonar.tests=tests
sonar.python.coverage.reportPaths=coverage.xml
sonar.python.xunit.reportPath=test-results.xml
```

```yaml
# GitHub Action for SonarQube
name: SonarQube Analysis
on: [push, pull_request]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest coverage
    
    - name: Run tests with coverage
      run: |
        coverage run -m pytest
        coverage xml
    
    - name: SonarQube Scan
      uses: sonarqube-quality-gate-action@master
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## Pre-commit Hooks

Automate quality checks before commits:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files

  - repo: https://github.com/psf/black
    rev: 22.10.0
    hooks:
      - id: black

  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort

  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v0.991
    hooks:
      - id: mypy
```

```bash
# Install and setup
pip install pre-commit
pre-commit install

# Run manually
pre-commit run --all-files
```

## Continuous Integration

### Quality Gates

```yaml
# .github/workflows/quality.yml
name: Code Quality
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pylint black mypy pytest coverage
    
    - name: Lint with pylint
      run: pylint src/ --fail-under=8.0
    
    - name: Check formatting with black
      run: black --check src/
    
    - name: Type check with mypy
      run: mypy src/
    
    - name: Run tests with coverage
      run: |
        coverage run -m pytest
        coverage report --fail-under=80
```

### Quality Dashboards

```python
# quality_report.py
import json
import subprocess
from pathlib import Path

def run_quality_checks():
    """Run all quality checks and generate report."""
    results = {}
    
    # Pylint score
    try:
        output = subprocess.check_output(['pylint', 'src/', '--output-format=json'])
        pylint_data = json.loads(output.decode())
        results['pylint_score'] = calculate_pylint_score(pylint_data)
    except subprocess.CalledProcessError:
        results['pylint_score'] = 0
    
    # Test coverage
    try:
        subprocess.run(['coverage', 'run', '-m', 'pytest'], check=True)
        output = subprocess.check_output(['coverage', 'json'])
        coverage_data = json.loads(Path('coverage.json').read_text())
        results['coverage'] = coverage_data['totals']['percent_covered']
    except subprocess.CalledProcessError:
        results['coverage'] = 0
    
    # Code complexity
    try:
        output = subprocess.check_output(['radon', 'cc', 'src/', '--json'])
        complexity_data = json.loads(output.decode())
        results['avg_complexity'] = calculate_avg_complexity(complexity_data)
    except subprocess.CalledProcessError:
        results['avg_complexity'] = 0
    
    return results

def generate_quality_report(results):
    """Generate HTML quality report."""
    html = f"""
    <html>
    <head><title>Code Quality Report</title></head>
    <body>
        <h1>Code Quality Dashboard</h1>
        <div class="metrics">
            <div class="metric">
                <h3>Pylint Score</h3>
                <div class="score">{results['pylint_score']:.1f}/10</div>
            </div>
            <div class="metric">
                <h3>Test Coverage</h3>
                <div class="score">{results['coverage']:.1f}%</div>
            </div>
            <div class="metric">
                <h3>Avg Complexity</h3>
                <div class="score">{results['avg_complexity']:.1f}</div>
            </div>
        </div>
    </body>
    </html>
    """
    
    Path('quality-report.html').write_text(html)

if __name__ == '__main__':
    results = run_quality_checks()
    generate_quality_report(results)
    print(f"Quality report generated: {json.dumps(results, indent=2)}")
```

## Refactoring Strategies

### Identifying Code Smells

Common code smells to watch for:

```python
# Long Method
def process_order(order):
    # 100+ lines of code
    # Multiple responsibilities
    # Hard to understand and test

# Solution: Extract smaller methods
def process_order(order):
    validate_order(order)
    calculate_totals(order)
    apply_discounts(order)
    process_payment(order)
    send_confirmation(order)
    update_inventory(order)

# Large Class
class OrderProcessor:
    # 50+ methods
    # Multiple responsibilities
    # Hard to maintain

# Solution: Split into focused classes
class OrderValidator:
    def validate(self, order): pass

class PaymentProcessor:
    def process(self, payment): pass

class InventoryManager:
    def update(self, items): pass
```

### Refactoring Techniques

```python
# Extract Method
def calculate_price(self):
    # Before
    base_price = self.quantity * self.item_price
    if self.quantity > 100:
        base_price *= 0.95
    if self.is_premium_customer:
        base_price *= 0.9
    return base_price

# After  
def calculate_price(self):
    base_price = self.quantity * self.item_price
    base_price = self.apply_quantity_discount(base_price)
    base_price = self.apply_customer_discount(base_price)
    return base_price

def apply_quantity_discount(self, price):
    return price * 0.95 if self.quantity > 100 else price

def apply_customer_discount(self, price):
    return price * 0.9 if self.is_premium_customer else price
```

## Documentation Standards

### Code Documentation

```python
def calculate_tax(amount: float, tax_rate: float, region: str) -> float:
    """Calculate tax amount for a given transaction.
    
    Args:
        amount: The base amount before tax (must be positive)
        tax_rate: Tax rate as decimal (e.g., 0.08 for 8%)
        region: Tax region code (e.g., 'US', 'EU')
    
    Returns:
        The calculated tax amount
        
    Raises:
        ValueError: If amount is negative or tax_rate is invalid
        
    Example:
        >>> calculate_tax(100.0, 0.08, 'US')
        8.0
    """
    if amount < 0:
        raise ValueError("Amount must be non-negative")
    if not 0 <= tax_rate <= 1:
        raise ValueError("Tax rate must be between 0 and 1")
    
    return amount * tax_rate
```

### Architecture Documentation

```markdown
# Architecture Decision Record (ADR)

## Status
Accepted

## Context
We need to choose a database for our user management system.

## Decision
We will use PostgreSQL as our primary database.

## Consequences
**Positive:**
- ACID compliance ensures data consistency
- Rich feature set including JSON support
- Strong ecosystem and tooling
- Good performance characteristics

**Negative:**
- Additional operational complexity
- Higher resource requirements than simple databases
- Steeper learning curve for team members

## Alternatives Considered
- MongoDB: Rejected due to consistency requirements
- SQLite: Rejected due to scalability limitations
```

!!! tip "Quality is a Journey"
    Code quality improvement is an ongoing process. Start with the most impactful practices and gradually expand your quality toolkit.