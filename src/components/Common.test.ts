import {
  isFloat,
  capitalizeFirstChar,
  endpointUrl,
  epochToDate,
  currencyFormat,
  convertUTCDateToLocalDate
} from "./Common";

test("properly determines if this is a float - should be false", () => {
  expect(isFloat(10)).toBeFalsy();
});

test("properly determines if this is a float - should be true", () => {
  expect(isFloat(10.1)).toBeTruthy();
});

test("determine capitalize first letter", () => {
  expect(capitalizeFirstChar("foo")).toStrictEqual("Foo");
});

test("determine capitalize first letter - two words", () => {
  expect(capitalizeFirstChar("foo bar")).toStrictEqual("Foo bar");
});

test("determine capitalize first letter - already capital", () => {
  expect(capitalizeFirstChar("Foo bar")).toStrictEqual("Foo bar");
});

test("determine endpoint URL", () => {
  expect(endpointUrl()).toMatch(/(http|https)/);
  //let myString = parseInt(process.env.REACT_APP_ENDPOINT_PORT.toString());
  expect(endpointUrl()).toContain(":" + process.env.REACT_APP_ENDPOINT_PORT);
  expect(endpointUrl()).toContain(process.env.REACT_APP_ENDPOINT_SERVER + ":");
});

test("determine the epoch date", () => {
  expect(epochToDate(0)).toEqual(new Date("1970-01-01T00:00:00.000Z"));
});

test("determine the epoch date - 6pm", () => {
  expect(epochToDate(1609524000000)).toEqual(new Date("2021-01-01T18:00:00.000Z"));
});

test("determine the epoch date - 12pm", () => {
  expect(epochToDate(1609502400000)).toEqual(new Date("2021-01-01T12:00:00.000Z"));
});

test("determine the epoch date - near midnight", () => {
  expect(epochToDate(1609459199000)).toEqual(new Date("2020-12-31T23:59:59.000Z"));
});

test("determine the epoch date - at midnight", () => {
  expect(epochToDate(1609459200000)).toEqual(new Date("2021-01-01T00:00:00.000Z"));
});

test("result in a currency format - more chars", () => {
  expect(currencyFormat("3.1415")).toEqual('3.14');
});

test("result in a currency format - less chars", () => {
  expect(currencyFormat("3.1")).toEqual('3.10');
});

//TODO: do I want this behavior?
test("result in a currency format - invalid", () => {
  expect(currencyFormat("Foo")).toEqual("NaN");
});

test("convert date from utc to local time", () => {
  expect( convertUTCDateToLocalDate(new Date("2021-01-01T00:00:00.000Z"))).toEqual(new Date("2021-01-01T00:00:00.000-06:00"));
});

