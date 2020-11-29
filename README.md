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
# yarn add react-uuid
yarn add uuid
yarn add datejs
# yarn add canvas
yarn add --dev react-test-renderer
# yarn add --dev jest-dom
yarn add --dev @testing-library/jest-dom
yarn add --dev @testing-library/react
yarn add --dev @testing-library/react-hooks
# yarn add --dev canvas
yarn add material-table @material-ui/core
yarn add levenary
yarn add typescript
yarn add react-material-snackbar
yarn add lodash
yarn global add npm-check-updates
yarn add env-cmd -g
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
```yarn run eject```
