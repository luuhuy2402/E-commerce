import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./contexts/app.context.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx";
import "./i18n/i18n";
import { HelmetProvider } from "react-helmet-async";

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 0, // Disable retry on failure
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <AppProvider>
                        <ErrorBoundary>
                            <App />
                        </ErrorBoundary>
                    </AppProvider>

                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </HelmetProvider>
        </BrowserRouter>
    </StrictMode>
);
