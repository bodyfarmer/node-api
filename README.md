
## Getting started
Clone the project

```sh
# Install dependencies
npm install


### Environmental variables in development

The project uses [dotenv](https://www.npmjs.com/package/dotenv) for setting environmental variables during development. Simply copy `.env.example`, rename it to `.env` and add your env vars as you see fit. 
```

### Run
```sh
# npm
npm start
```
### Deployment

Deployment is specific to hosting platform/provider but generally:

```sh
# npm
npm run build
```
will compile your `src` into `/dist`, and 
### Deployment with Angular
```sh
Copy Angular app's '/dist' folder content into '/public' folder in Node.js app
```


