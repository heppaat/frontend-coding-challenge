Question: Assuming the list of names are fetched from an actual api, how would you implement authentication, rate limiting handling, error handling, api unavailability? - What kind of retry strategies you’d imagine implementing?

Answer:
Authentication could be implemented by using tokens like JSON web tokens.
login form: collect user credentials
login api call: send credentials to the authentication endpoint
token storage: save the received token in localStorage.
attach token to requests: add the token to the authorization header of subsequent API requests

Error handling should be implemented on both backend and frontend sides. Backend should send back proper HTTP status codes and error messages. Frontend should also handle these errors to provide better user experience by displaying user-friendly messages.

API unavailability is when the frontend cannot successfully communicate with the backend API. This can happen for several reasons: network issues, server downtime, API rate limiting.
We could use cached data stored in localStorage.

Question: How can we protect the app from being abused?
Answer: Both on frontend and backend we would have to implement various security measures like Input validation, rate limiting on API requests, secure authentication methods like JWT (mentioned before), using HTTPS which ensures all communication between the client and server is encrypted

Question: How can we deploy the app into a cloud environment?
Answer: Generally we have to prepare the project for deployment at the frontend side: by running the build command to generate production ready files.
Then upload the files to a cloud storage service like Amazon, Azure, Google Cloud Storage.
On backend side: ensure that the application is using a production database, after its uploaded to the cloud provider, necessary dependencies have to be installed on cloud server, and server has to have npm and Node.js installed. Using DOCKER could simplify the deployment process

Question: How can we be sure the app is running with the latest version of code?
Answer: Setting up continuous integration and continuous deployment (CI/CD) pipelines using different tools like Jenkins
Including automated tests in the pipeline to verify the integrity of the codebase before deployment. Automate the deployment process to deploy new changes to production environments quickly.
Git branching model: Ensure that only approved changes re merged into the main branch

Question: What kind of accessibility best practices should we keep in mind?
Answer: semantic html, keyboard only approach, color contrast, alt text, use appropriate labels and instructions for form fields, provide error messages in understandable format

Question; How would you structure the css so that we have the most reusability but also the least leakage between components?
Answer: Document style guidelines best practices for project, ensuring consistency between developers.
Keeping html, js, css separately. Using scoped stylesheets to ensure styles are scoped to a specific component.
