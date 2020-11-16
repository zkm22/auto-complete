export function getOptions(text: string, timeout: number = 1000): Promise<string[]> {
  console.log(text)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([1,2,3,4,5].map(n => text + n));
    }, timeout);
  });
}
