Mocking: Each test uses jest.mock to mock the database interactions and other external dependencies like bcrypt and jsonwebtoken.

Request and Response Mocking: The mockRequest and mockResponse functions are used to create mock request and response objects for the tests, simulating the behavior of Express.js.

Test Cases: Each method in the controllers has corresponding test cases to check:

Successful operations (e.g., successful registration, login, project creation).
Handling of errors (e.g., user already exists, project not found).
Middleware functionality (e.g., verifying tokens and checking admin roles).
Assertions: The tests include assertions to ensure that the expected response status and JSON output match the actual output from the controller methods.
