import {
  IAdBanner,
  IAddBannerResponse,
  ISliderResponse,
} from '../../interfaces/addBanner';
import axios from '../../lib';

export interface ICreateResponse {
  message: string;
  data: IAdBanner[];
}

const createAddBanner = async (
  bannerData: FormData
): Promise<Partial<ICreateResponse>> => {
  const { data } = await axios.post(`/banners`, bannerData);
  return data;
};

const getAddBanner = async (filter: {
  [key: string]: string | number | boolean;
}): Promise<IAddBannerResponse> => {
  let url = `/banners?not_slider=true`;
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
const getSlider = async (): Promise<ISliderResponse> => {
  const url = `/banners/slider`;

  const { data } = await axios.get(url);

  return data;
};

const updateAddBanner = async (bannerData: Partial<IAdBanner> | FormData, id: number | string) => {
  const { data } = await axios.patch(`/banners/${id}`, bannerData);
  return data;
};

const deleteBanner = async (faqId: number | string) => {
  const { data } = await axios.delete(`/banners/?ids=[${faqId}]`);
  return data.data;
};

const addBannerService = {
  createAddBanner,
  getAddBanner,
  updateAddBanner,
  deleteBanner,
  getSlider,
};

export default addBannerService;
