import axios from '../../lib';

import { ICampaign, ICampaignResponse } from '../../interfaces/campaign';

const createCampaign = async (
  categoryData: Partial<ICampaign> | FormData
): Promise<Partial<ICampaignResponse>> => {
  const headers = categoryData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
  const { data } = await axios.post(`/campings`, categoryData, { headers });
  return data;
  
};

const getCampaign = async (filter: {
  [key: string]: string | number;
}): Promise<ICampaignResponse> => {
  let url = `/campings`;
  if (filter && Object.keys(filter).length > 0) {
    const queryString = Object.entries(filter)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');

    url += `?${queryString}`;
  }
  const { data } = await axios.get(url);
  return data;
};

const updateCampaign = async (
  slug: number | string,
  campaigndata: Partial<ICampaign>
) => {
  const { data } = await axios.patch(`/campings/${slug}`, campaigndata, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

const deleteCampaign = async (id: number) => {
  const { data } = await axios.delete(`/campings/?ids=[${id}]`);
  return data;
};

const campaignService = {
  createCampaign,
  getCampaign,
  updateCampaign,
  deleteCampaign,
};

export default campaignService;
