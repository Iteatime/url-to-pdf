# URL to PDF

This app is a PDF generator, its purpose is to convert web pages to documents.
Here you will find sources, Dockerfile and Google Cloud Build configuration files.
It uses [Puppeteer](https://github.com/GoogleChrome/puppeteer), check out [these instructions](https://cloud.google.com/appengine/docs/standard/nodejs/using-headless-chrome-with-puppeteer) to learn more.

## How To start:

* Here you'll have two choices run on our docker environment or on your local one.
* By default, it runs on `localhost:8080/?url=<page_url>[&api=<api_key>]`.

### 1 Local

#### 1.1 Requirements:

* Node.js (at least version 8.x): [latest](https://nodejs.org/en/download/current/)
* nodemon (optional): npm install -g nodemon
* ts-node: npm install -g ts-node typescript

#### 1.2 Installation:

* Here you have to clone this repo then you can run: `npm install`
* Then you can add your API key as `API_KEY` environment variable.

#### 1.3 Dev server:

* If you chosed to install `nodemon` you can run the watch via: `npm run dev`
* Else you can start without the watch via: `npm start`

### 2 Docker

#### 2.1 Requirements:

* Docker: [windows-mac](https://www.docker.com/get-started), [linux](https://hub.docker.com/search/?type=edition&offering=community)

#### 2.2 Installation:

* To build the docker image run the file: `docker.build.sh`.

#### 2.3 Dev server:    

* You can start the watch by running the file: `docker.run.sh [api-key]`.   

## Continous deployment:

The code pushed on this repo is continously deployed to [App Engine](https://cloud.google.com/appengine/docs/standard/nodejs/an-overview-of-app-engine).

`master` is the production branch. What you push there is built and sent live [here](https://url-to-pdf.acrabadabra.com).

Any other branch or pull request will be automatically deployed too. Check out [Google Cloud Build](https://cloud.google.com/cloud-build/docs/configuring-builds/build-test-deploy-artifacts#build_triggered_from_github) to learn more.

## Manual deployment:

You can deploy manualy this app using the [Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts) by running this command:
`gcloud builds submit --config cloudbuild.manual.yaml .`

## Params:

You can customize the pdf setting by using those query parms:

* `name`: define the filename,
* `format`: the document format,
* `scale`: the scale to witch is rendered the page,
* `marginTop`: the top margin,
* `marginLeft`: the left marging,
* `marginBottom`: the bottom margin,
* `marginRight`: the right margin,

They're discribed on the [Puppeteer API doc](https://github.com/GoogleChrome/puppeteer/blob/v1.12.2/docs/api.md#pagepdfoptions)