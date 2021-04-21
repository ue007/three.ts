import returnsPromise from './test-promise';
import getData from './test-axios';
import postData from './test-fetch';

import App from './app';
import './style.css';

const app = new App({
  id: 'id',
});

console.log(app);

returnsPromise('hello').then(
  (result) => {
    alert(result);
  },
  (err) => {
    console.error(err);
  },
);

getData('/api/user').then(
  (result) => {
    console.log(result);
  },
  (err) => {
    console.error(err);
  },
);

getData('/api/user/list').then(
  (result) => {
    console.log(result);
  },
  (err) => {
    console.error(err);
  },
);

// getData('/api/user/error').then(
//   (result) => {
//     console.log(result);
//   },
//   (err) => {
//     console.error(err);
//   },
// );

postData('/api/login/account').then(
  (result) => {
    console.log(result);
  },
  (err) => {
    console.error(err);
  },
);

// test mock api
// fetch('/api/user')
//   .then((res) => res.json())
//   .catch((error) => console.error('Error:', error))
//   .then((response) => console.log('Success:', response));

// fetch('/api/user/list')
//   .then((res) => res.json())
//   .catch((error) => console.error('Error:', error))
//   .then((response) => console.log('Success:', response));

// const account = async () => {
//   await fetch(
//     'https://jsonplaceholder.typicode.com/todos',
//   );
// };

// const promise = async () => {
//   await fetch('/api/user')
//     .then((res) => res.json())
//     .catch((error) => console.error('Error:', error))
//     .then((response) => console.log('Success:', response));
// };

// const readFile = (fileName: string) => new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(`成功：${fileName}`);
//   }, 2000);
// });

// const asyncReadFile = async function () {
//   const f1 = await readFile('/etc/fstab');
//   const f2 = await readFile('/etc/shells');
//   console.log(f1.toString());
//   console.log(f2.toString());
// };

// readFile('hello world').then(
//   (result) => {
//     console.log(result);
//   },
//   (err) => {
//     console.error(err);
//   },
// );
