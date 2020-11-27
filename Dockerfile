# pull official base image
#FROM node:15.3.0-alpine
FROM node:15.3.0

# RUN curl -o- -L https://yarnpkg.com/install.sh | \  bash -s -- --version 0.26.1
# RUN yarn global add nodemon@1.11.0


# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
# COPY package-lock.json ./
COPY yarn.lock ./
# RUN npm install --silent
RUN yarn add react-scripts -g --silent
RUN yarn build --profile production

COPY .env ./

# add app
COPY . ./

# start app
CMD ["yarn", "start", "--env=production"]
