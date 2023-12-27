import { ICommentResponse } from '../../interfaces/comment';
import axios from '../../lib';

const getComment = async (filter: {
  [key: string]: string | number;
}): Promise<ICommentResponse> => {
  let url = `/comments`;
  if (filter && Object.keys(filter).length > 0) {
    const queryString = Object.entries(filter)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');

    // Add query string to the URL
    url += `?${queryString}`;
  }
  const { data } = await axios.get(url);
  return data;
};

const commentService = {
  getComment,
};

export default commentService;
