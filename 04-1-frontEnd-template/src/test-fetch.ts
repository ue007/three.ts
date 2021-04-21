const postData = async (url: string): Promise<number | void> => fetch(url, {
  method: 'POST',
  body: JSON.stringify({
    username: 'admin',
    password: '888888',
  }),
})
  .then((res) => console.log(res.json()))
  .catch((error) => console.error('Error:', error))
  .then((response) => console.debug('Success:', response));

export default postData;
