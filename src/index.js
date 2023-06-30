import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContextProvider } from "./context";
import { BrowserRouter } from "react-router-dom";
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "./redux/reducers";

const store = createStore(reducers, compose(applyMiddleware(thunk)));

const root = ReactDOM.createRoot(document.getElementById("root"));

const client = new QueryClient();
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <UserContextProvider>
        <QueryClientProvider client={client}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </UserContextProvider>
    </Provider>
  </React.StrictMode>
);
