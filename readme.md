npx create-react-app raspi-finance-react

## packages required for the project

```shell
yarn add react-table
yarn add react-router-dom
yarn add node-sass
yarn add react-bootstrap
yarn add bootstrap
yarn add react-spinners
yarn add react-loader-spinner
yarn add react-select
yarn add axios
yarn add dotenv
yarn add storybook
yarn add react-file-picker
yarn add @material-ui/lab
yarn add uuid
yarn add datejs
yarn add material-table @material-ui/core
yarn add levenary
yarn add typescript
yarn add react-material-snackbar
yarn add lodash
yarn add moment
yarn add moment-timezone
yarn add @date-io/moment@1.x moment
yarn add @material-ui/icons
yarn add react-tooltip
yarn add react-data-grid
yarn add react-query
yarn add @types/react-datepicker
yarn add graphql
yarn add @apollo-client
yarn add react-apollo
yarn add graphql-tag
yarn add formik
yarn add react-bootstrap
yarn add yup
yarn add --dev jest
yarn add --dev @types/jest
yarn add --dev cypress start-server-and-test --dev
# yarn add --dev jest-dom
# yarn add --dev @testing-library/jest-dom
yarn add --dev @testing-library/react
yarn add --dev @testing-library/react-hooks
yarn add --dev react-test-renderer
yarn add --dev @types/cypress
yarn add --dev caniuse-lite
yarn add --dev msw
yarn global add npm-check-updates
yarn global add env-cmd
```

## strict ssl turned off

```
yarn config set "strict-ssl" false -g
```

## codepen examples

```
https://codepen.io/alanshortis/pen/eJLVXr
https://codepen.io/danhearn/pen/MvqgdM
https://codepen.io/cs1342d/pen/wvaPmRN
https://codepen.io/benhoyle/pen/vyygYN
```

yarn start

https://github.com/mbrn/material-table/issues/1162

## cleanup axios calls

```
Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
```

## example cleanup

```
https://codesandbox.io/s/l458746w89?from-embed=&file=/src/AxiosHooksComponent.js:127-723
```

## upgrade packages

```
ncu -u
```

## features to add

```
lower case all entries going over the wire
add the reoccurring feature
add a blob for receipts
add row click feature
add keyboard shortcuts
click on cleared (no refresh)
add a dialog box
context api
```

## color picker

```
https://material.io/design/color/the-color-system.html#tools-for-picking-colors
```

## normalize the code

```
prettier --no-semi --write .
```

## character set issue

The character encoding of the HTML document was not declared.
The document will render with garbled text in some browser configurations if the document contains characters from outside the US-ASCII range.
The character encoding of the page must be declared in the document or in the transfer protocol.

```
<meta charset="utf-8"/>
```

## stop using react-script

`yarn run eject`

## save docker image for this project

```
docker save -o raspi-finance-react-docker.tar raspi-finance-react:latest
docker load -i raspi-finance-react-docker.tar
```

issue

```
warning @types/react-loader-spinner@4.0.0: This is a stub types definition. react-loader-spinner provides its own type definitions, so you do not need this installed.
warning react-scripts > babel-eslint@10.1.0: babel-eslint is now @babel/eslint-parser. This package will no longer receive updates.
warning react-scripts > webpack-dev-server > chokidar > fsevents@1.2.13: fsevents 1 will break on node v14+ and could be using insecure binaries. Upgrade to fsevents 2.
```

varnish

```
varnishadm
```
