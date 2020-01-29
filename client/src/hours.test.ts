import { getOpenState, getDayIntervals, relativeDistance } from "./hours";

describe("getOpenState", () => {
  it.each<[string, string, string, boolean, string | undefined]>([
    [
      "detects open state and next closing",
      "Mo-Fr 14-18",
      "2020-01-20T14:30:00.000Z",
      true,
      "2020-01-20T18:00:00.000Z",
    ],
    [
      "detects closed state and next opening",
      "Mo-Fr 14-18",
      "2020-01-20T18:30:00.000Z",
      false,
      "2020-01-21T14:00:00.000Z",
    ],
    [
      "only looks for next change within next 24 hours",
      "Th-Fr 14-18",
      "2020-01-20T18:30:00.000Z",
      false,
      undefined,
    ],
    [
      "handles perpetually open places",
      "24/7",
      "2020-01-20T18:30:00.000Z",
      true,
      undefined,
    ],
    [
      "handles perpetually closed places",
      "24/7 off",
      "2020-01-20T18:30:00.000Z",
      false,
      undefined,
    ],
  ])(
    "%s",
    (
      _testName,
      hours,
      dateString,
      expectedState,
      expectedNextOpenOrCloseString,
    ) => {
      const date = new Date(dateString);
      const expectedNextOpenOrClose = expectedNextOpenOrCloseString
        ? new Date(expectedNextOpenOrCloseString)
        : undefined;
      const expectedOpenState = {
        state: expectedState,
        nextOpenOrClose: expectedNextOpenOrClose,
      };

      const openState = getOpenState(hours, date);

      expect(openState).toEqual(expectedOpenState);
    },
  );
});

describe("getDayIntervals", () => {
  it("includes intervals from all sub-rules", () => {
    const hours = "Mo-Fr 14-18, We 10-12";
    const date = new Date("2020-01-22T18:30:00.000Z");

    const dayIntervals = getDayIntervals(hours, date);

    expect(dayIntervals).toEqual([
      [
        new Date("2020-01-22T10:00:00.000Z"),
        new Date("2020-01-22T12:00:00.000Z"),
        false,
        undefined,
      ],
      [
        new Date("2020-01-22T14:00:00.000Z"),
        new Date("2020-01-22T18:00:00.000Z"),
        false,
        undefined,
      ],
    ]);
  });

  it("includes the following morning", () => {
    const hours = "Fr-Su 22-5";
    const date = new Date("2020-01-18T18:30:00.000Z");

    const dayIntervals = getDayIntervals(hours, date);

    expect(dayIntervals).toEqual([
      [
        new Date("2020-01-18T00:00:00.000Z"),
        new Date("2020-01-18T05:00:00.000Z"),
        false,
        undefined,
      ],
      [
        new Date("2020-01-18T22:00:00.000Z"),
        new Date("2020-01-19T05:00:00.000Z"),
        false,
        undefined,
      ],
    ]);
  });
});

describe("relativeDistance", () => {
  it("returns distance in German", () => {
    const target = new Date("2020-01-20T23:35:00.000Z");
    const now = new Date("2020-01-20T18:00:00.000Z");

    const distance = relativeDistance(target, now);

    expect(distance).toEqual("in etwa 6 Stunden");
  });

  it("uses correct grammar for one hour", () => {
    const target = new Date("2020-01-20T18:55:00.000Z");
    const now = new Date("2020-01-20T18:00:00.000Z");

    const distance = relativeDistance(target, now);

    expect(distance).toEqual("in etwa einer Stunde");
  });
});
