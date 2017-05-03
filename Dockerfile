# Dockerfile
FROM node:7


# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /opt/app
COPY . /opt/app

# Build and optimize react app
#RUN npm run build

EXPOSE 3000

# defined in package.json
# these commands will be ran whenever any of our code changes
CMD [ "npm", "run", "start:docker-dev" ]