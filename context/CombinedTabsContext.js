import { DiscoverProvider } from "./DiscoverContext";
import { ReadingListProvider } from "./ReadingListContext";
import { FinishedBooksProvider } from "./FinishedBooksContext";
import { CurrentPageProvider } from "./CurrentPageContext";

export default function CombinedTabsContext({ children }) {
  return (
    <FinishedBooksProvider>
      <DiscoverProvider>
        <ReadingListProvider>
          <CurrentPageProvider>{children}</CurrentPageProvider>
        </ReadingListProvider>
      </DiscoverProvider>
    </FinishedBooksProvider>
  );
}
