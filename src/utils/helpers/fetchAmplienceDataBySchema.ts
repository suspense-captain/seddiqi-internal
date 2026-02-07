import { CmsContext } from "@contexts/cmsContext";
import fetchContent, { GetByFilterRequest } from "@utils/cms/fetchContent";

export async function fetchAmplienceDataBySchema(
  context: CmsContext,
  filterBy: {
    path: string;
    value: any;
  }[] = []
) {
  const fetchPage = async (nextCursor?: string): Promise<any> => {
    const filterRequest: GetByFilterRequest = {
      filterBy: filterBy,
      page: {
        size: 10,
        cursor: nextCursor,
      },
    };

    const results = (await fetchContent([filterRequest], context))[0];

    console.log({ results });

    const responses = results?.responses || [];

    if (results?.page?.nextCursor) {
      return [...responses, ...(await fetchPage(results?.page.nextCursor))];
    }
    return responses;
  };

  return fetchPage();
}
