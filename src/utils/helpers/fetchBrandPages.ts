import { CmsContext } from "@contexts/cmsContext";
import fetchContent, { GetByFilterRequest } from "@utils/cms/fetchContent";

export async function fetchBrandPages(
  context: CmsContext,
  options: { key?: string } = {}
) {
  const fetchPage = async (nextCursor?: string): Promise<any> => {
    const filterRequest: GetByFilterRequest = {
      filterBy: [
        {
          path: "/_meta/schema",
          value: "https://seddiqi.amplience.com/page/brand-page",
        },
      ],
      page: {
        size: 10,
        cursor: nextCursor,
      },
    };

    const results = (await fetchContent([filterRequest], context))[0];

    const responses = results?.responses || [];

    if (results?.page?.nextCursor) {
      return [...responses, ...(await fetchPage(results?.page.nextCursor))];
    }
    return responses;
  };

  return fetchPage();
}
