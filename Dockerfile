# pull official base image
#FROM node:15.3.0-alpine
FROM node:15.3.0

RUN apt-get update -qq
RUN apt-get install -y apt-transport-https ca-certificates

RUN curl -k -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt install -y yarn

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
# COPY package-lock.json ./
COPY yarn.lock ./
# RUN npm install --silent
RUN yarn config set "strict-ssl" false -g
RUN yarn add react-scripts -g --silent
#RUN yarn build --profile production

COPY .env ./

# add app
COPY . ./

EXPOSE 3000

# start app
CMD ["yarn", "start"]
