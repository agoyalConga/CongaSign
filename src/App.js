import { useState } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Agreement from './Components/Agreement';
import AgreementDetails from './Components/AgreementDetails';
import Navbar from './Components/Navbar';
import Proposal from './Components/Proposal';
import ProposalDetails from './Components/ProposalDetails';
import { AgreementData, ProposalData } from './Data-Model/data-model';

let NamesArray= [{fullName: 'Jay Nayak'}, {fullName: 'Rudra Bhojak'}]
let ischeckedfromApp= false;
function App() {
  const [Names, setNames] = useState(NamesArray);
  const onSaveName= (newName) => {
    setNames((prevNames)=> {
      return [...prevNames, newName];
    })
  }

  const [agreement, setAgreement] = useState(AgreementData);
  const onSaveNewAgreement= (newAgreement) => {
    setAgreement((prevAgreement) => {
      return [...prevAgreement, newAgreement];
    })
  }

  const [proposal, setProposal] = useState(ProposalData);
  const onSaveNewProposal= (newProposal) => {
    setProposal((prevProposal)=> {
      return [...prevProposal, newProposal];
    })
    //setFilteredList(proposal);
  }
  //const [lineItems, setLineItems]= useState(agreement.AgreementLineItems);
  const onRemoveLine= (index, agrIndex) => {
    setAgreement(agreement[agrIndex].AgreementLineItems.splice(index, 1));
  }

  //const [agrDetails, setAgrDetails]= useState();

  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Agreement agreement={agreement} onSaveNewAgreement= {onSaveNewAgreement} Names={Names} ischeckedfromApp={ischeckedfromApp} />} />
          <Route path="proposal/" element={<Proposal proposals={proposal}  setProposal={setProposal} onSaveNewProposal= {onSaveNewProposal} onSaveName={onSaveName} />} />
          <Route path="agreement/:id" element={<AgreementDetails agreement={agreement} onRemoveLine= {onRemoveLine} />} />
          <Route path="proposal/:id" element={<ProposalDetails proposal={proposal} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
export default App;
