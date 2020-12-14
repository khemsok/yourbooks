// Context
import CombinedTabsProvider from "../context/CombinedTabsContext";

// Containers
import MainTabs from "../containers/MainTabs";

// MUI
import Container from "@material-ui/core/Container";

export default function Home() {
  return (
    <CombinedTabsProvider>
      <Container maxWidth="lg">
        <MainTabs />
      </Container>
    </CombinedTabsProvider>
  );
}
