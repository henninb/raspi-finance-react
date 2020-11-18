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
yarn global add npm-check-updates
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


## missing callback
```
AccountSummaryTable.jsx:    const postCall = async (payload) => {
AccountSummaryTable.jsx:    const deleteCall = async (payload) => {
PaymentTable.tsx:    const postCallPayment = async (payload: any) => {
PaymentTable.tsx:    const deleteCall = async (payload: any) => {
SelectDescription.tsx:    const postDescription = async (payload: any) => {
TransactionImage.tsx:    const handleButtonClick = async () => {
TransactionImage.tsx:    const changeReceiptImage = async () => {
TransactionMove.tsx:    const handleButtonClick = async () => {
TransactionMove.tsx:    const fetchActiveAccounts = async () => {
TransactionTable.jsx:    const handlerForUpdatingTransactionState = async (guid) => {
TransactionTable.jsx:    const toggleReoccurring = async (guid, reoccurring) => {
TransactionTable.jsx:    const changeTransactionReoccurringStatus = async (guid, reoccurring) => {
TransactionTable.jsx:    const putCall = async (newData, oldData) => {
TransactionTable.jsx:    const deleteCall = async (payload) => {
TransactionTable.jsx:    const postCall = async (payload) => {
```

