let timeout = 1000;

export function getOptions(text: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([0,1,2,3,4].map(n => text + n));
    }, timeout);
  });
}

export function changeTimeout(t: number) {
  timeout = t;
}
