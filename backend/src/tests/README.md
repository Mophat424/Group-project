
Authcontroller.test
Mocking: Each test uses jest.mock to mock the database interactions and other external dependencies like bcrypt and jsonwebtoken.

Request and Response Mocking: The mockRequest and mockResponse functions are used to create mock request and response objects for the tests, simulating the behavior of Express.js.

Test Cases: Each method in the controllers has corresponding test cases to check:

Successful operations (e.g., successful registration, login, project creation).
Handling of errors (e.g., user already exists, project not found).
Middleware functionality (e.g., verifying tokens and checking admin roles).
Assertions: The tests include assertions to ensure that the expected response status and JSON output match the actual output from the controller methods.

Auth middleware Test
Each test checks specific scenarios, such as:
No Token Provided: Verifies that the middleware responds with a 401 status and an appropriate message when no token is present.
Invalid Token: Tests that the middleware responds with a 401 status when an invalid token is provided.
Valid Token: Checks that the middleware correctly decodes a valid token, attaches the user payload to the request, and calls the next() function.

AuthRoutes Test:

Tests the user registration and login processes by simulating HTTP requests to the /api/auth endpoint.
Verifies that the registration endpoint responds correctly when valid data is sent and returns a token.
Checks for proper error handling when invalid data is submitted, ensuring that the response includes error messages.


ProjectRoutes Test:

Tests creating and updating projects via the /api/project endpoint.
Simulates authentication by mocking the authMiddleware, ensuring that the user is authenticated during the requests.
Checks that the expected project data is returned in the response.

