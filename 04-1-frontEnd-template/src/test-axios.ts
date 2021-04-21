import axios from 'axios';

const getData = async (url: string): Promise<number> => axios.get(url);

export default getData;
