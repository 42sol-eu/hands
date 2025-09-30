# Contributing

Thank you for your interest in contributing to Hands! This guide will help you get started with contributing to our testing tools documentation and resources.

!!! tip "Informatoin"

    The `hands` repository is mainly for collective documentation and training. If you are interested in supporting a specific tool, because you have expertise in it or want to support its aim, feel free to jump right into those projects.  

## How to Contribute

There are many ways to contribute to this project:

- 📝 **Documentation**: Improve existing docs or add new content
- 🛠️ **Tools**: Add new testing tools or update existing tool information
- 💡 **Best Practices**: Share your testing experience and methodologies
- 🐛 **Bug Reports**: Report issues with the documentation or examples (check if they are closly connected to one of our packages and post them there if possible.)
- ✨ **Feature Requests**: Suggest new sections or improvements (in this repository we want to pick bones with you, tell us what we are missing to make your testing experiance even better.)

## Getting Start 

!!! tip
    
    This is the "GitHub Standard Process"
    You will need a free or paid Github account.


### Overview

1. Fork and clone
2. Set up development environment
3. Branch and work
4. Test and document
5. Submit and discuss
6. Release and celebrate


### Step 1 to 2

=== "manual"

    ```bash
    # Fork the repository on GitHub, then clone your fork
    git clone https://github.com/{{user_name}/hands.git
    cd hands

    # Install dependencies
    uv sync

    # Start the documentation server
    mkdocs serve
    ```

    Visit http://127.0.0.1:8000 to preview your changes locally.

=== "hands on magic"

    ```bash
    # setup hands/scaphoid
    pipx install 42sol_hands_scaphoid
    scaphoid setup hands-contributing
    ```

    !!! note "Scaphoids magic"

        Scaphoid is the shell package in the hands collection. It will super charge your file system and file interaction experiance - cross-plattform!

### Step 3

=== "manual"

    ```bash
    # Create a branch
    git switch --create feature/{{id}}_{{user-name}}
    code .
    ```
=== "hands on magic"

    ```bash
        # Create a branch
        scaphoid git new feature
        # ^- {{id}}_{{user-name}} will be prompted for or taken from your environment.
        scaphoid code
    ```

# Step 4 

=== "manual"

    ```bash
    # Create a branch
    git switch --create feature/{{id}}_{{user-name}}
    code .
    ```
=== "hands on magic"

    ```bash
    # Create a branch
    scaphoid git new feature
    # ^- {{id}}_{{user-name}} will be prompted for or taken from your environment.
    scaphoid code 
    ```

# Step 5 

=== "manual"

    ```bash
    # Commit your changes (often)

    # TODO: improve this
    ```
=== "hands on magic"

    ```bash
    scaphoid git push feature
    ```

# Step 6

=== "manual"

    ```bash
    # more to come
    ```
=== "hands on magic"

    ```bash
    # more magic
    scaphoid magic
    ```

## Documentation Guidelines

!!! info "We believe in hands on" 

    Instead of writing long guide lines, read into our documentation and start tapping the beat.
    Find the melody and start humming...

### Code Examples

- Use realistic, runnable examples
- Include necessary imports and setup
- Add comments to explain complex parts
- Test your examples before submitting 

!!! info "We believe handy organization" 

    Moving stuff around is a day to day business,
    especially if you are working in a set of packages. Therefore we strongly believe in file and project identification. (Check out our file head and use `scaphoid file stamp` to keep you and us sane).


### 2. PR Description

Use this template for your pull request:

```markdown
## Description
Brief description of what this PR adds/changes.

//TODO: this needs to be automated !

## Type of Change
- [ ] Documentation improvement
- [ ] New tool addition
- [ ] Best practice update
- [ ] Bug fix
- [ ] Other (please describe)

## Checklist
- [ ] I have tested my changes locally
- [ ] I have checked for spelling/grammar errors
- [ ] All links are working
- [ ] I have followed the style guidelines
- [ ] I have updated navigation if needed
```

### 3. Review Process

1. **Automated checks**: Ensure all checks pass
2. **Peer review**: Address feedback from reviewers
3. **Maintainer review**: Final approval from project maintainers
4. **Merge**: Your contribution becomes part of the project!

## Code of Conduct

### Our Standards

- **Be respectful**: Treat everyone with kindness and respect
- **Be inclusive**: Welcome contributors from all backgrounds
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone is learning

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing private information without permission
- Any other conduct that would be inappropriate in a professional setting

## Recognition

Contributors are recognized in several ways:

- **Contributors page**: Listed on our contributors page
- **Commit history**: Your contributions are part of the project history
- **Community appreciation**: Recognition in release notes for significant contributions

## Getting Help

### Questions?

- 💬 **Discussions**: Use GitHub Discussions for general questions
- 🐛 **Issues**: Create an issue for bugs or specific problems
- 📧 **Email**: Contact maintainers directly for sensitive matters

### Resources

- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [Markdown Guide](https://www.markdownguide.org/)

## Development Tips

### Local Development

```bash
# Watch for changes and auto-reload
mkdocs serve --dev-addr=127.0.0.1:8000

# Build the site
mkdocs build

# Check for broken links
mkdocs build --strict
```

### Project Structure

```
hands/
├── docs/                  # Documentation source
│   ├── getting-started/   # Getting started guides
│   ├── tools/            # Tool documentation
│   ├── best-practices/   # Best practices
│   └── reference/        # Reference materials
├── mkdocs.yml            # MkDocs configuration
└── pyproject.toml        # Project dependencies
```

Thank you for contributing to Hands! Your efforts help make testing more accessible and effective for everyone. 🎉