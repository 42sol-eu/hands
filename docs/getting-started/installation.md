# Installation

Getting started with Hands is straightforward. This guide will walk you through the installation process and initial setup.

## Prerequisites

Before installing Hands, ensure you have:

- Python 3.13 or higher
- Git (for version control)
- A text editor or IDE

## Installation Methods

### Using uv (Recommended)

```bash
# Clone the repository
git clone https://github.com/42sol-eu/hands.git
cd hands

# Install dependencies using uv
uv sync
```

### Using pip

```bash
# Clone the repository  
git clone https://github.com/42sol-eu/hands.git
cd hands

# Install in development mode
pip install -e .
```

## Verify Installation

To verify that everything is installed correctly:

```bash
# Check Python version
python --version

# Verify mkdocs is working
mkdocs --version
```

## Next Steps

Now that you have Hands installed, check out the [Quick Start](quick-start.md) guide to begin exploring the testing tools and documentation.

!!! tip "Development Setup"
    If you plan to contribute to the documentation, you can serve the docs locally:
    ```bash
    mkdocs serve
    ```
    Then visit http://127.0.0.1:8000 to view the documentation.