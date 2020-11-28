#FROM node:15.3.0-alpine
FROM node:15.3.0

ARG TIMEZONE="set the time zone at build time"
ENV TIMEZONE ${TIMEZONE}
ARG APP="set the app at build time"
ENV APP ${APP}
ARG USERNAME="set the username as build time"
ENV USERNAME=${USERNAME}
RUN useradd -m ${USERNAME}

RUN cp /usr/share/zoneinfo/${TIMEZONE} /etc/localtime
RUN mkdir -p -m 0755 /opt/${APP}
COPY .env /opt/${APP}
COPY . /opt/${APP}
COPY package.json /opt/${APP}
COPY yarn.lock /opt/${APP}
RUN chown -R ${USERNAME}:${USERNAME} /opt/${APP}/
RUN chown -R ${USERNAME}:${USERNAME} /opt/${APP}/*

# RUN apt-get update -qq
# RUN npm install -g -s --no-progress yarn

#RUN npm install -g yarn
    # yarn && \
    # yarn run build && \
    # yarn run prune && \
    # yarn cache clean

WORKDIR /opt/${APP}

RUN yarn config set "strict-ssl" false -g
RUN yarn config set no-progress
# RUN yarn add react-scripts -g --silent
RUN yarn add react-scripts -g

#RUN yarn build --profile production

# RUN yarn install --production=true && yarn build

RUN yarn run build
#RUN yarn run prune
USER ${USERNAME}

ENV HOST=0.0.0.0
ENV NODE_ENV=production
# CMD yarn start
# CMD [ "node", "build/index.js" ]
# CMD [ "node", "build/index.html" ]
# CMD [ "node", "build/server.js" ]
CMD [ "yarn", "start" ]
