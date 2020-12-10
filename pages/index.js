// Context
import { CurrentPageProvider } from "../context/CurrentPageContext";
import { DiscoverProvider } from "../context/DiscoverContext";
import { ReadingListProvider } from "../context/ReadingListContext";

// Containers
import MainTabs from "../containers/MainTabs";

// MUI
import Container from "@material-ui/core/Container";

export default function Home() {
  return (
    <>
      <Container maxWidth="lg">
        <MainTabs />
      </Container>
    </>
  );
}
