import { AuthProvider } from "./AuthContext";
import { DiscoverProvider } from "./DiscoverContext";
import { ReadingListProvider } from "./ReadingListContext";
import { FinishedBooksProvider } from "./FinishedBooksContext";
import { CurrentPageProvider } from "./CurrentPageContext";

export default function CombinedContext({ children }) {
  return (
    <AuthProvider>
      <FinishedBooksProvider>
        <DiscoverProvider>
          <ReadingListProvider>
            <CurrentPageProvider>{children}</CurrentPageProvider>
          </ReadingListProvider>
        </DiscoverProvider>
      </FinishedBooksProvider>
    </AuthProvider>
  );
}
