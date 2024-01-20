import { IFaq, IFaqResponse } from '../../interfaces/faq';
import axios from '../../lib';

export interface ICreateResponse {
  message: string;
  data: IFaq[];
}

const createFaq = async (faqData: IFaq): Promise<Partial<ICreateResponse>> => {
  const { data } = await axios.post(`/faqs`, faqData);
  return data;
};

const getFaqs = async (filter: {
  [key: string]: string | number | boolean;
}): Promise<IFaqResponse> => {
  let url = `/faqs`;

  // Filter out keys with false values
  const filteredFilter: { [key: string]: string | number | boolean } = {};
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== false) {
      filteredFilter[key] = value;
    }
  });

  if (Object.keys(filteredFilter).length > 0) {
    const queryString = Object.entries(filteredFilter)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
      )
      .join('&');

    // Add query string to the URL
    url += `?${queryString}`;
  }
  const { data } = await axios.get(url);
  return data;
};

const updateFaq = async (faqData: Partial<IFaq>) => {
  const { data } = await axios.patch(`/faqs/${faqData.id}`, faqData);
  return data;
};

const deleteFaq = async (faqId: number | string) => {
  const { data } = await axios.delete(`/faqs/?ids=[${faqId}]`);
  return data.data;
};

const faqService = {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
};

export default faqService;
