## HubSpot Developer Project Example - Appointment Scheduling

## Overview
This is an example of how to make a HubSpot private app w/ UI extensions to communicate
with a theoretical business's appointment scheduling API. The api for this example is a make believe
system for a company that has repair technicians that go to customer's homes to fix things. The
company has a website where customers can schedule appointments with the technicians. The company
uses HubSpot to manage their customers and their website. The company wants to be able to schedule
appointments in their system when a customer schedules an appointment on their website.

For this example specifically, we assume a CSR is scheduling an appointment for a customer. The CSR
is on the contact record in HubSpot and clicks a button to schedule an appointment. The CSR is then
presented with a UI extension that allows them to select a date and time for the appointment, along
with a list of technicians that are available at that time. The CSR selects a technician and clicks
a button to schedule the appointment. The UI extension then makes a request to the API via 
a serverless function (this acts a proxy to the API) to schedule the appointment. 

Since we cannot access local storage from a UI extension, we maintain an in-memory state for the
authentication credentials (access token) for the API. Upon refresh, the access token will be gone and the CSR
will need to login again.


## Development

### Setup NestJS
This project uses [NestJS](https://nestjs.com/) for our backend API. NestJS is a NodeJS framework that is built on top of ExpressJS.
It comes with a lot of great features out of the box, including a dependency injection system, a module system, 
a CLI, and has TypeScript as a first class citizen.

1. Install NestJS CLI globally: `npm install -g @nestjs/cli`
2. cd into the `api` directory
3. Install dependencies: `npm install` or `yarn install`
4. Run the app: `npm run start:dev` or `yarn start:dev`
5. The app will be running on `http://localhost:3000`

Swagger docs are available at `http://localhost:3000/swagger-ui`

### Setup UI Extension


## Deployment
This project can be deployed to any cloud provider that supports NodeJS. I personally am
using [Railway](https://railway.app/) for this project. Railway is a PaaS similar to Heroku. It offers a generous
free tier and is very easy to use. Railway also has a CLI that can be installed with `npm install -g @railway/cli`.

### Setup Railway
1. Create a Railway account
2. Create a New project
3. Create a MySQL database
4. Create a service by linking your github repository to this project
5. Once linked, a build will kick off and fail, due to our repository structure. 
    1. Go to `Settings` -> `General` -> `Root Directory`
       - Enter `/scheduler-api`
    2. Go to `Settings` -> `Build` -> `Build Command`
       - Enter `npm run build` or `yarn build`
    3. Go to `Settings` -> `Deploy` -> `Start Command`
       - Enter `npm run start:prod` or `yarn start:prod`
    4. Go to `Variables` -> `New Variable`
       - For the key, enter `DATABASE_URL`
       - For the value, enter the `${{MySQL.MYSQL_URL}}` which is a reference to the MySQL database you created earlier
6. Your project should not build/deploy successfully. The last thing to do is expose a public URL for your extension to hit.
    1. Go to `Settings` -> `Environment` -> `Domains`
    2. Click `Generate Domain` this should give you a URL you can now use to access the API

### Setup HubSpot
Since HubSpot doesn't allow us to specify a sub-path within our repository, to listen to changes to, like railyway. We are going to just use `hs project upload` for this example. This GitHub thing could change in the future, so keep your eyes out even if this repo isnt updated.

### Goals
These will be done slowly over time, as I have a few minutes during the workday and when my team does some fun coding projects.

- [x] Create a faux API to simulate a company's backend service
- [ ] Create a UI extension that allows a CSR to schedule an appointment for a customer
- [ ] Create a serverless function that acts as a proxy to the API
- [ ] Create a private app that allows the UI extension to authenticate with the API
- [ ] Create a website theme using React Themes (in beta) to replace the default theme
- [ ] Create a custom object to store the appointment data
- [ ] Create a workflow for appointment reminders/lifecycle that is triggered via the UI extension and the api backend
- [ ] Create a custom report that shows the number of appointments scheduled per technician
- [ ] Create a custom report that shows the number of appointments scheduled per customer
- [ ] Create a custom report that shows the number of appointments scheduled per day/month/year
- [ ] Create notes that are stored in HubDB for each appointment, which who made the note and when
