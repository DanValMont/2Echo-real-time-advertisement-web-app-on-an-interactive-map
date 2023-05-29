import "../styles/globals.css";
import { MapStoreProvider } from "../context/MapStore";
import { SnackbarProvider } from "notistack";

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <MapStoreProvider>
        <Component {...pageProps} />
      </MapStoreProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
