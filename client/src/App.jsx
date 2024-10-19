import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { GlobalContextProvider } from "./context/createContext";
import Header from "./components/Header";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceDetails from "./pages/InvoiceDetails";
import UpdateInvoice from "./pages/UpdateInvoice";

const App = () => {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/invoice-info/:invoiceId" element={<InvoiceDetails />} />
          <Route path="/edit-invoice/:invoiceId" element={<UpdateInvoice />} />
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  );
};

export default App;
