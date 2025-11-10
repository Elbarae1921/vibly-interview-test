// date-override.ts
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 4);

// Save original Date constructor
const OriginalDate = Date;

// Override global Date constructor function
function MockDate(...args: ConstructorParameters<typeof Date>) {
  // @ts-ignore
  if (args.length === 0) {
    return new OriginalDate(sixMonthsAgo);
  }
  // @ts-ignore - We need to allow calling as a function
  return new OriginalDate(...args);
}

// Copy static methods
MockDate.now = () => sixMonthsAgo.getTime();
MockDate.parse = OriginalDate.parse;
MockDate.UTC = OriginalDate.UTC;
MockDate.prototype = OriginalDate.prototype;

// Replace global Date
(window as any).Date = MockDate;
