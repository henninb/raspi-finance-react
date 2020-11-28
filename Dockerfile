#FROM node:15.3.0-alpine
FROM node:15.3.0

ARG TIMEZONE="set the time zone at build time"
ENV TIMEZONE ${TIMEZONE}
ARG APP="set the app at build time"
ENV APP ${APP}
ARG USERNAME="set the username as build time"
ENV USERNAME=${USERNAME}
RUN useradd ${USERNAME}

RUN cp /usr/share/zoneinfo/${TIMEZONE} /etc/localtime
RUN mkdir -p -m 0755 /opt/${APP}

# RUN apt-get update -qq
# RUN npm install -g -s --no-progress yarn

#RUN npm install -g yarn
    # yarn && \
    # yarn run build && \
    # yarn run prune && \
    # yarn cache clean

WORKDIR /opt/${APP}

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
# RUN npm install --silent
RUN yarn config set "strict-ssl" false -g
RUN yarn config set no-progress
RUN yarn add react-scripts -g --silent
#RUN yarn build --profile production

COPY .env ./
COPY . ./

# RUN yarn run build
# RUN yarn run prune

CMD yarn start
