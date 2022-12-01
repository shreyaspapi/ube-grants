import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import Home from "./components/home";
import Header from "./components/header";
import CardsList from "./components/cards";
import Proposal from "./components/proposal";
import ProposalForm from "./components/proposal-form";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CardsList />,
  },
  {
    path: "/proposal",
    element: <Proposal />,
  },
  {
    path: "/submit-new-proposal",
    element: <ProposalForm />,
  },
]);

function App() {
  return (
    <div className="App">
      <Header />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
