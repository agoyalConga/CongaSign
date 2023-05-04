import '../App.css';
import { useState } from "react";
import { Link } from 'react-router-dom';
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBBadge, MDBInput, MDBInputGroup, MDBIcon } from 'mdb-react-ui-kit';
import { FaColumns } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function Proposal(props) {

    const [filteredList, setFilteredList] = new useState(props.proposals);
    let query = '';
    const filterBySearch = () => {
        var updatedList = [...props.proposals];
        updatedList = updatedList.filter((proposal) => {
            return proposal.ProposalName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
        setFilteredList(updatedList);
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let newQuoteInputs = {
        id: null,
        ProposalName: '',
        Status: '',
        AccountName: '',
        Opportunity: '',
        StartDate: null,
        EndDate: null,
        PrimaryContact: '',
        ProposalLineItems: []
    }
    let lastElementId = null;

    const onSave = (event) => {
        event.preventDefault();
        //newAGRInputs.StartDate= format(new Date(newAGRInputs.StartDate), 'mm/dd/yyyy');
        newQuoteInputs.id = lastElementId + 1;
        console.log(JSON.stringify(newQuoteInputs));
        props.onSaveNewProposal(newQuoteInputs);
        setFilteredList(...newQuoteInputs);
        handleClose();
    }


    return (
        <div className='margin-top'>
            <div className='d-flex justify-content-between labelTop'>
                <h3 className='labelLeft'><FaColumns /> Quote/Proposal</h3>
                <div className='searchBar'>
                    <MDBInputGroup>
                        <MDBInput label='Search' onChange={e => { query = e.target.value }} />
                        <MDBBtn rippleColor='dark' onClick={filterBySearch}>
                            <MDBIcon icon='search' />
                        </MDBBtn>
                    </MDBInputGroup>
                </div>
                <div className="labelRight">
                    <MDBBtn onClick={handleShow} outline><strong>New</strong></MDBBtn>
                </div>
            </div>
            <hr />
            <div className='container-fluid'>
                <MDBTable striped hover>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'></th>
                            <th scope='col'><strong>Proposal Name</strong></th>
                            <th scope='col'><strong>Status</strong></th>
                            <th scope='col'><strong>Account</strong></th>
                            <th scope='col'><strong>Opportunity</strong></th>
                            <th scope='col'><strong>Start Date</strong></th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {filteredList.map((proposal, index) => (
                            <tr key={proposal.id}>
                                <th scope='row'>{lastElementId = proposal.id}</th>
                                <td>
                                    <Link to={'/proposal/' + index}>
                                        {proposal.ProposalName}
                                    </Link>
                                </td>
                                <td>
                                    <MDBBadge color='success' pill>
                                        {proposal.Status}
                                    </MDBBadge>
                                </td>
                                <td>{proposal.AccountName}</td>
                                <td>{proposal.Opportunity}</td>
                                <td>{proposal.StartDate}</td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </div>

            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Quote/Proposal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlName">
                            <Form.Label>Proposal Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => { newQuoteInputs.ProposalName = e.target.value }} autoFocus />
                        </Form.Group>
                        <div className='row'>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={e => { newQuoteInputs.Status = e.target.value }}>
                                    <option>None</option>
                                    <option value="Draft">Draft</option>
                                    <option value="In Signature">In Signature</option>
                                    <option value="In Effect">In Effect</option>
                                    <option value="Expired">Expired</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlAccount">
                            <Form.Label>Account</Form.Label>
                            <Form.Control type="text" onChange={e => { newQuoteInputs.AccountName = e.target.value }} autoFocus />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlContact">
                            <Form.Label>Primary Contact</Form.Label>
                            <Form.Control type="text" onChange={e => { newQuoteInputs.PrimaryContact = e.target.value }} autoFocus />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlContact">
                            <Form.Label>Opportunity</Form.Label>
                            <Form.Control type="text" onChange={e => { newQuoteInputs.Opportunity = e.target.value }} autoFocus />
                        </Form.Group>
                        <div className='row'>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control type="date" onChange={e => { newQuoteInputs.StartDate = e.target.value }} autoFocus />
                            </Form.Group>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput3">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control type="date" onChange={e => { newQuoteInputs.EndDate = e.target.value }} autoFocus />
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <MDBBtn color="secondary" onClick={handleClose}>
                        Close
                    </MDBBtn>
                    <MDBBtn onClick={onSave}>
                        Save
                    </MDBBtn>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Proposal;