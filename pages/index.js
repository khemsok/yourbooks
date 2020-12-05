// Containers
import Navbar from "../containers/Navbar";
import MainTabs from "../containers/MainTabs";

// MUI
import Container from "@material-ui/core/Container";

export default function Home() {
  return (
    <>
      <Container maxWidth="xl">
        <Navbar />
      </Container>
      <Container maxWidth="lg">
        <MainTabs />
      </Container>
    </>
  );
}
