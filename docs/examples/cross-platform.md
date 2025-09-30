# Cross-Platform Testing Examples

This page demonstrates synchronized tabs that show the same testing concepts across different programming languages and tools.

## Setting Up Unit Tests

=== "Python"
    ```python
    # test_user.py
    import pytest
    from myapp.models import User

    class TestUser:
        def test_create_user(self):
            user = User("John", "john@example.com")
            assert user.name == "John"
            assert user.email == "john@example.com"
        
        def test_user_validation(self):
            with pytest.raises(ValueError):
                User("", "invalid-email")
    ```

=== "JavaScript"
    ```javascript
    // user.test.js
    const User = require('./models/User');

    describe('User', () => {
        test('should create user with valid data', () => {
            const user = new User('John', 'john@example.com');
            expect(user.name).toBe('John');
            expect(user.email).toBe('john@example.com');
        });
        
        test('should throw error for invalid data', () => {
            expect(() => {
                new User('', 'invalid-email');
            }).toThrow('Invalid user data');
        });
    });
    ```

=== "Java"
    ```java
    // UserTest.java
    import org.junit.jupiter.api.Test;
    import static org.junit.jupiter.api.Assertions.*;

    class UserTest {
        @Test
        void shouldCreateUserWithValidData() {
            User user = new User("John", "john@example.com");
            assertEquals("John", user.getName());
            assertEquals("john@example.com", user.getEmail());
        }
        
        @Test
        void shouldThrowExceptionForInvalidData() {
            assertThrows(IllegalArgumentException.class, () -> {
                new User("", "invalid-email");
            });
        }
    }
    ```

## Running Tests

=== "Python"
    ```bash
    # Install pytest
    pip install pytest
    
    # Run all tests
    pytest
    
    # Run with coverage
    pytest --cov=myapp
    
    # Run specific test file
    pytest test_user.py
    ```

=== "JavaScript"
    ```bash
    # Install Jest
    npm install --save-dev jest
    
    # Run all tests
    npm test
    
    # Run with coverage
    npm test -- --coverage
    
    # Run specific test file
    npm test user.test.js
    ```

=== "Java"
    ```bash
    # Using Maven
    mvn test
    
    # Run with coverage (JaCoCo)
    mvn jacoco:report
    
    # Run specific test class
    mvn test -Dtest=UserTest
    ```

## Test Configuration

=== "Python"
    ```toml
    # pyproject.toml
    [tool.pytest.ini_options]
    testpaths = ["tests"]
    addopts = [
        "--cov=myapp",
        "--cov-report=html",
        "--cov-report=term-missing"
    ]
    markers = [
        "slow: marks tests as slow",
        "integration: marks tests as integration tests"
    ]
    ```

=== "JavaScript"
    ```json
    {
      "name": "my-project",
      "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage"
      },
      "jest": {
        "testEnvironment": "node",
        "collectCoverageFrom": [
          "src/**/*.js",
          "!src/**/*.test.js"
        ],
        "coverageThreshold": {
          "global": {
            "branches": 80,
            "functions": 80,
            "lines": 80,
            "statements": 80
          }
        }
      }
    }
    ```

=== "Java"
    ```xml
    <!-- pom.xml -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.0.0-M9</version>
                <configuration>
                    <includes>
                        <include>**/*Test.java</include>
                        <include>**/*Tests.java</include>
                    </includes>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <version>0.8.8</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>prepare-agent</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>report</id>
                        <phase>test</phase>
                        <goals>
                            <goal>report</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
    ```

## Mocking Dependencies

=== "Python"
    ```python
    # test_service.py
    import pytest
    from unittest.mock import Mock, patch
    from myapp.services import UserService

    def test_user_service_with_mock():
        # Create mock database
        mock_db = Mock()
        mock_db.find_user.return_value = {"id": 1, "name": "John"}
        
        service = UserService(mock_db)
        user = service.get_user(1)
        
        assert user["name"] == "John"
        mock_db.find_user.assert_called_once_with(1)

    @patch('myapp.services.EmailService')
    def test_user_registration(mock_email_service):
        service = UserService()
        service.register_user("john@example.com")
        
        mock_email_service.send_welcome_email.assert_called_once()
    ```

=== "JavaScript"
    ```javascript
    // service.test.js
    const UserService = require('./UserService');
    const EmailService = require('./EmailService');

    // Mock the EmailService
    jest.mock('./EmailService');

    describe('UserService', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('should get user from database', () => {
            const mockDb = {
                findUser: jest.fn().mockReturnValue({
                    id: 1, 
                    name: 'John'
                })
            };
            
            const service = new UserService(mockDb);
            const user = service.getUser(1);
            
            expect(user.name).toBe('John');
            expect(mockDb.findUser).toHaveBeenCalledWith(1);
        });

        test('should send welcome email on registration', () => {
            const service = new UserService();
            service.registerUser('john@example.com');
            
            expect(EmailService.sendWelcomeEmail).toHaveBeenCalledTimes(1);
        });
    });
    ```

=== "Java"
    ```java
    // UserServiceTest.java
    import org.junit.jupiter.api.Test;
    import org.junit.jupiter.api.extension.ExtendWith;
    import org.mockito.Mock;
    import org.mockito.junit.jupiter.MockitoExtension;
    import static org.mockito.Mockito.*;
    import static org.junit.jupiter.api.Assertions.*;

    @ExtendWith(MockitoExtension.class)
    class UserServiceTest {
        
        @Mock
        private UserRepository userRepository;
        
        @Mock
        private EmailService emailService;

        @Test
        void shouldGetUserFromDatabase() {
            // Given
            User mockUser = new User(1L, "John");
            when(userRepository.findById(1L)).thenReturn(mockUser);
            
            UserService service = new UserService(userRepository);
            
            // When
            User user = service.getUser(1L);
            
            // Then
            assertEquals("John", user.getName());
            verify(userRepository).findById(1L);
        }

        @Test
        void shouldSendWelcomeEmailOnRegistration() {
            UserService service = new UserService(userRepository, emailService);
            
            service.registerUser("john@example.com");
            
            verify(emailService).sendWelcomeEmail("john@example.com");
        }
    }
    ```

!!! tip "Synchronized Navigation"
    Notice how when you click on any language tab above, all the tab groups on this page switch to that same language. This makes it easy to follow examples across different sections while staying in the same programming language context.

## Benefits of Synchronized Tabs

1. **Consistent Context**: Users can view all examples in their preferred language
2. **Better UX**: No need to manually switch each tab group
3. **Reduced Cognitive Load**: Stay focused on one language at a time
4. **Professional Appearance**: Clean, organized documentation layout