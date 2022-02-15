export default function isRomanNumber(num: string): boolean {
  if (!num || num === "") {
    return false;
  }
  for (let i = 0; i < num.length; i++) {
    if (
      num[i] !== "C" &&
      num[i] !== "D" &&
      num[i] !== "I" &&
      num[i] !== "L" &&
      num[i] !== "M" &&
      num[i] !== "V" &&
      num[i] !== "X"
    ) {
      return false;
    }
  }
  return true;
}
