import { isFloat, capitalizeFirstChar, endpointUrl, epochToDate } from "./Common";

test("properly determines if this is a float - should be false", () => {
  expect(isFloat(10)).toBeFalsy()
});

test("properly determines if this is a float - should be true", () => {
    expect(isFloat(10.1)).toBeTruthy();
});

test('determine capitalize first letter', () => {
    expect(capitalizeFirstChar('foo')).toStrictEqual('Foo')
})

test('determine capitalize first letter - two words', () => {
    expect(capitalizeFirstChar('foo bar')).toStrictEqual('Foo bar')
})

test('determine capitalize first letter - already capital', () => {
    expect(capitalizeFirstChar('Foo bar')).toStrictEqual('Foo bar')
})

test('determine endpoint URL', () => {
    expect(endpointUrl()).toMatch(/(http|https)/)
    expect(endpointUrl()).toContain(":" + process.env.REACT_APP_ENDPOINT_PORT)
    expect(endpointUrl()).toContain( process.env.REACT_APP_ENDPOINT_SERVER + ":")

})

test('determine the epoch date', () => {
    console.log(new Date('1970-01-01T00:00:00.000Z'))
    expect(epochToDate(0)).toBe(new Date('1970-01-01T00:00:00.000Z'))
})
