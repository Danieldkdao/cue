import { useQueryStates } from "nuqs";
import { snippetsSearchParams } from "../lib/params";

export const useSnippetParams = () => {
  return useQueryStates(snippetsSearchParams, { shallow: false });
};
