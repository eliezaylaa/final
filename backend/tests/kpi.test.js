describe("KPI calculations", () => {
  test("hours worked calculation", () => {
    const checkIn = new Date("2026-06-05T08:00:00");
    const checkOut = new Date("2026-06-05T16:00:00");
    const hours = (checkOut - checkIn) / 3600000;
    expect(hours).toBe(8);
  });
  test("estimated pay calculation", () => {
    const hours = 8;
    const salary = 15;
    expect(hours * salary).toBe(120);
  });
  test("zero hours when no checkout", () => {
    const checkOut = null;
    const checkIn = new Date();
    const hours = checkOut ? (checkOut - checkIn) / 3600000 : 0;
    expect(hours).toBe(0);
  });
});
