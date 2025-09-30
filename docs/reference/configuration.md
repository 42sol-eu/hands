# Configuration

This section provides comprehensive configuration options for Hands testing tools and framework.

## Project Configuration

### pyproject.toml

The main project configuration file:

```toml
[project]
name = "hands"
version = "2025.0.1"
description = "Overview of the testing tools."
readme = "README.md"
requires-python = ">=3.13"
dependencies = [
    "mkdocs-material>=9.6.19",
    "mkdocs-minify-plugin>=0.8.0",
    "mike>=2.1.3",
]

[project.optional-dependencies]
docs = [
    "mkdocs-material>=9.6.19", 
    "mkdocs-minify-plugin>=0.8.0",
    "mike>=2.1.3",
]
dev = [
    "pytest>=7.0.0",
    "black>=22.0.0",
    "pylint>=2.15.0",
    "mypy>=0.991",
]
test = [
    "pytest>=7.0.0",
    "pytest-cov>=4.0.0",
    "pytest-mock>=3.10.0",
    "requests>=2.28.0",
]

[tool.mkdocs]
config-file = "mkdocs.yml"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

### MkDocs Configuration

Complete `mkdocs.yml` configuration:

```yaml
site_name: Hands - Testing Tools
site_url: https://hands-testing-tools.example
site_author: Andreas Felix Häberle
site_description: Comprehensive overview of testing tools and methodologies

# Repository
repo_name: 42sol-eu/hands
repo_url: https://github.com/42sol-eu/hands
edit_uri: edit/main/docs/

# Copyright
copyright: Copyright &copy; 2025 Andreas Felix Häberle

# Configuration
theme:
  name: material
  language: en
  
  # Palette configuration
  palette:
    # Dark Mode
    - scheme: slate
      media: "(prefers-color-scheme: dark)"
      toggle:
        icon: material/brightness-4
        name: Switch to light mode
      primary: green
      accent: deep purple

    # Light Mode
    - scheme: default
      media: "(prefers-color-scheme: light)"
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
      primary: green
      accent: deep orange
  
  # Features
  features:
    - announce.dismiss
    - content.action.edit
    - content.action.view
    - content.code.annotate
    - content.code.copy
    - content.tooltips
    - navigation.expand
    - navigation.footer
    - navigation.indexes
    - navigation.sections
    - navigation.tabs
    - navigation.tabs.sticky
    - navigation.top
    - navigation.tracking
    - search.highlight
    - search.share
    - search.suggest
    - toc.follow
    - toc.integrate
  
  # Icons
  icon:
    repo: fontawesome/brands/github
    edit: material/pencil
    view: material/eye
    
  # Font
  font:
    text: Roboto
    code: Roboto Mono

# Plugins
plugins:
  - search:
      separator: '[\s\-,:!=\[\]()"`/]+|\.(?!\d)|&[lg]t;|(?!\b)(?=[A-Z][a-z])'
  - minify:
      minify_html: true

# Markdown Extensions
markdown_extensions:
  - abbr
  - admonition
  - attr_list
  - def_list
  - footnotes
  - md_in_html
  - toc:
      permalink: true
      title: On this page
  - pymdownx.arithmatex:
      generic: true
  - pymdownx.betterem:
      smart_enable: all
  - pymdownx.caret
  - pymdownx.details
  - pymdownx.emoji:
      emoji_generator: !!python/name:material.extensions.emoji.to_svg
      emoji_index: !!python/name:material.extensions.emoji.twemoji
  - pymdownx.highlight:
      anchor_linenums: true
      line_spans: __span
      pygments_lang_class: true
  - pymdownx.inlinehilite
  - pymdownx.keys
  - pymdownx.magiclink:
      repo_url_shorthand: true
      user: 42sol-eu
      repo: hands
  - pymdownx.mark
  - pymdownx.smartsymbols
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  - pymdownx.tabbed:
      alternate_style: true
  - pymdownx.tasklist:
      custom_checkbox: true
  - pymdownx.tilde

# Navigation
nav:
  - Home: index.md
  - Getting Started:
    - Installation: getting-started/installation.md
    - Quick Start: getting-started/quick-start.md
  - Testing Tools:
    - Overview: tools/overview.md
    - Unit Testing: tools/unit-testing.md
    - Integration Testing: tools/integration-testing.md
    - End-to-End Testing: tools/e2e-testing.md
  - Best Practices:
    - Testing Strategy: best-practices/strategy.md
    - Code Quality: best-practices/code-quality.md
  - Reference:
    - API: reference/api.md
    - Configuration: reference/configuration.md
  - Contributing: contributing.md

# Additional Configuration
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/42sol-eu
      name: GitHub
  version:
    provider: mike
    default: stable

# Extra CSS and JavaScript
extra_css:
  - stylesheets/extra.css

extra_javascript:
  - javascripts/mathjax.js
  - https://polyfill.io/v3/polyfill.min.js?features=es6
  - https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
```

## Testing Configuration

### pytest Configuration

```toml
# pyproject.toml
[tool.pytest.ini_options]
minversion = "7.0"
addopts = [
    "-ra",
    "--strict-markers",
    "--strict-config",
    "--cov=src",
    "--cov-report=term-missing",
    "--cov-report=html",
    "--cov-report=xml",
]
testpaths = ["tests"]
markers = [
    "slow: marks tests as slow (deselect with '-m \"not slow\"')",
    "integration: marks tests as integration tests",
    "unit: marks tests as unit tests",
    "e2e: marks tests as end-to-end tests",
]
```

### Coverage Configuration

```toml
# pyproject.toml
[tool.coverage.run]
source = ["src"]
omit = [
    "*/tests/*",
    "*/test_*.py",
    "*/__init__.py",
]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "if self.debug:",
    "if settings.DEBUG",
    "raise AssertionError",
    "raise NotImplementedError",
    "if 0:",
    "if __name__ == .__main__.:",
    "class .*\\bProtocol\\):",
    "@(abc\\.)?abstractmethod",
]
```

## Code Quality Configuration

### Black Configuration

```toml
# pyproject.toml
[tool.black]
line-length = 88
target-version = ['py39']
include = '\.pyi?$'
extend-exclude = '''
/(
  # directories
  \.eggs
  | \.git
  | \.hg
  | \.mypy_cache
  | \.tox
  | \.venv
  | build
  | dist
)/
'''
```

### isort Configuration

```toml
# pyproject.toml
[tool.isort]
profile = "black"
multi_line_output = 3
line_length = 88
known_first_party = ["hands"]
known_third_party = ["pytest", "requests"]
```

### Pylint Configuration

```toml
# pyproject.toml
[tool.pylint.main]
extension-pkg-whitelist = ["pydantic"]

[tool.pylint.messages_control]
disable = [
    "C0330",  # Wrong hanging indentation
    "C0326",  # Bad whitespace
    "R0903",  # Too few public methods
    "R0913",  # Too many arguments
]

[tool.pylint.format]
max-line-length = 88

[tool.pylint.design]
max-args = 10
max-locals = 20
max-returns = 6
max-branches = 12
max-statements = 50
```

### mypy Configuration

```toml
# pyproject.toml
[tool.mypy]
python_version = "3.9"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
disallow_untyped_decorators = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_ignores = true
warn_no_return = true
warn_unreachable = true
strict_equality = true

[[tool.mypy.overrides]]
module = "tests.*"
disallow_untyped_defs = false
```

## Environment Configuration

### Development Environment

```bash
# .env.development
DEBUG=true
LOG_LEVEL=DEBUG
DATABASE_URL=sqlite:///dev.db
API_BASE_URL=http://localhost:8000
CACHE_TTL=60
```

### Testing Environment

```bash
# .env.test
DEBUG=false
LOG_LEVEL=INFO
DATABASE_URL=sqlite:///:memory:
API_BASE_URL=http://localhost:8001
CACHE_TTL=0
PARALLEL_TESTS=true
```

### Production Environment

```bash
# .env.production
DEBUG=false
LOG_LEVEL=WARNING
DATABASE_URL=${DATABASE_URL}
API_BASE_URL=${API_BASE_URL}
CACHE_TTL=3600
SENTRY_DSN=${SENTRY_DSN}
```

## CI/CD Configuration

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  PYTHON_VERSION: '3.13'

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11, 3.13]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v4
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Cache dependencies
      uses: actions/cache@v3
      with:
        path: ~/.cache/pip
        key: ${{ runner.os }}-pip-${{ hashFiles('**/pyproject.toml') }}
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -e .[dev,test]
    
    - name: Lint with pylint
      run: pylint src/
    
    - name: Format check with black
      run: black --check src/ tests/
    
    - name: Type check with mypy
      run: mypy src/
    
    - name: Test with pytest
      run: pytest --cov --cov-report=xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        fail_ci_if_error: true

  docs:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: ${{ env.PYTHON_VERSION }}
    - name: Install dependencies
      run: pip install .[docs]
    - name: Build docs
      run: mkdocs build --strict
    - name: Deploy docs
      if: github.ref == 'refs/heads/main'
      run: mkdocs gh-deploy --force
```

### Pre-commit Configuration

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
      - id: check-merge-conflict
      - id: debug-statements

  - repo: https://github.com/psf/black
    rev: 23.1.0
    hooks:
      - id: black
        language_version: python3

  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort

  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.0.1
    hooks:
      - id: mypy
        additional_dependencies: [types-requests]

  - repo: https://github.com/pycqa/pylint
    rev: v2.16.2
    hooks:
      - id: pylint
```

## Docker Configuration

### Development Dockerfile

```dockerfile
# Dockerfile.dev
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --dev

# Copy source code
COPY . .

# Install package in development mode
RUN uv pip install -e .

EXPOSE 8000

CMD ["mkdocs", "serve", "--dev-addr=0.0.0.0:8000"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  docs:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "8000:8000"
    volumes:
      - .:/app
      - /app/.venv
    environment:
      - PYTHONPATH=/app
    command: mkdocs serve --dev-addr=0.0.0.0:8000

  test:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/.venv
    environment:
      - PYTHONPATH=/app
    command: pytest -v

  lint:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/.venv
    environment:
      - PYTHONPATH=/app
    command: >
      sh -c "
        black --check . &&
        pylint src/ &&
        mypy src/
      "
```

## IDE Configuration

### VS Code Settings

```json
// .vscode/settings.json
{
  "python.defaultInterpreterPath": "./.venv/bin/python",
  "python.testing.pytestEnabled": true,
  "python.testing.pytestArgs": ["tests"],
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.linting.mypyEnabled": true,
  "python.formatting.provider": "black",
  "python.sortImports.args": ["--profile", "black"],
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "files.exclude": {
    "**/.mypy_cache": true,
    "**/.pytest_cache": true,
    "**/htmlcov": true,
    "**/__pycache__": true
  }
}
```

### VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.pylint",
    "ms-python.mypy-type-checker",
    "ms-python.black-formatter",
    "ms-python.isort",
    "charliermarsh.ruff",
    "ms-toolsai.jupyter",
    "yzhang.markdown-all-in-one",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

!!! tip "Configuration Management"
    Keep configuration files in version control and document any environment-specific settings clearly.