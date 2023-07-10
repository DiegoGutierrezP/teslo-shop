import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "@/themes";
import { SWRConfig } from "swr/_internal";
import "@/styles/globals.css";
import { AuthProvider, CartProvider, UiProvider } from "@/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{
        clientId : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
      }} >
      <SWRConfig
        value={{
          //refreshInterval: 500,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <AuthProvider>
          <CartProvider>
            <UiProvider>
              <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <Component {...pageProps} />
              </ThemeProvider>
            </UiProvider>
          </CartProvider>
        </AuthProvider>
      </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  );
}
