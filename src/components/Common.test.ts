import { isFloat, capitalizeFirstChar } from "./Common";

test("properly determines if this is a float - should be false", () => {
  expect(isFloat(10)).toBeFalsy()
});

test("properly determines if this is a float - shoud be true", () => {
    expect(isFloat(10.1)).toBeTruthy();
});

test('determine capitalize first letter', () => {
    expect(capitalizeFirstChar('foo')).toBe('Foo')
})

test('determine capitalize first letter - two words', () => {
    expect(capitalizeFirstChar('foo bar')).toBe('Foo bar')
})

test('determine capitalize first letter - already capital', () => {
    expect(capitalizeFirstChar('Foo bar')).toBe('Foo bar')
})