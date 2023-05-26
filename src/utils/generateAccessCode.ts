export function generateAccessCode(length: number) {
  const num1: number = Number(`1${'0'.repeat(length - 1)}`);
  const num2: number = Number(`9${'0'.repeat(length - 1)}`);
  return Math.floor(num1 + Math.random() * num2).toString();
}
