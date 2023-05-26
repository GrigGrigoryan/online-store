export function generatePassword(length: number) {
  const characters: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result: string = '';
  for (let i: number = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * length));
  }
  return result;
}
