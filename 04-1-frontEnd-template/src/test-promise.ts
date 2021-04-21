const returnsPromise = async (name:string): Promise<string> => new Promise((resolve) => setTimeout(() => {
  resolve(`成功：${name}`);
}, 2000));

export default returnsPromise;
