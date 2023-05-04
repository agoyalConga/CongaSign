import '../App.css';
import { useState } from "react";
import { Link } from 'react-router-dom';
import {
    MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBBadge, MDBInputGroup, MDBInput, MDBIcon
} from 'mdb-react-ui-kit';
import { FaTable } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


function Agreement(props) {

    const [filteredList, setFilteredList] = useState(props.agreement);
    let query = '';
    const filterBySearch = () => {
        var updatedList = [...props.agreement];
        updatedList = updatedList.filter((agr) => {
            return agr.AgreementName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
        setFilteredList(updatedList);
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [newAGRInputs, setNewAGRInputs] = useState({
        id: null,
        AgreementName: '',
        Status: '',
        AgreementType: '',
        AccountName: '',
        StartDate: null,
        EndDate: null,
        PrimaryContact: '',
        AgreementLineItems: []
    });
    let lastElementId = null;

    function onSave(event) {
        event.preventDefault();
        //newAGRInputs.StartDate= format(new Date(newAGRInputs.StartDate), 'mm/dd/yyyy');
        console.log(event);
        newAGRInputs.id = lastElementId + 1;
        //console.log(JSON.stringify(newAGRInputs));
        props.onSaveNewAgreement(newAGRInputs);
        setFilteredList(prev => [...prev, newAGRInputs]);
        handleClose();
    }

    function onHandleChange(key, value) {
        setNewAGRInputs({...newAGRInputs,[key]:value});
    }
    
    return (
        <div className='margin-top'>
            <div className='d-flex justify-content-between labelTop'>
                <h3 className='labelLeft'><FaTable /> Agreement</h3>
                <div className='searchBar'>
                    <MDBInputGroup>
                        <MDBInput label='Search' onChange={e => { query = e.target.value }} />
                        <MDBBtn rippleColor='dark' onClick={filterBySearch}>
                            <MDBIcon icon='search' />
                        </MDBBtn>
                    </MDBInputGroup>
                </div>
                <div className='labelRight'>
                    <MDBBtn onClick={handleShow} outline><strong>New</strong></MDBBtn>
                </div>
            </div>
            <hr />
            <div className='container-fluid'>
                <MDBTable striped hover>
                    <MDBTableHead>
                        <tr className='StrongText'>
                            <th scope='col'></th>
                            <th scope='col'><strong>Agreement Name</strong></th>
                            <th scope='col'><strong>Status</strong></th>
                            <th scope='col'><strong>Agreement Type</strong></th>
                            <th scope='col'><strong>Account</strong></th>
                            <th scope='col'><strong>Start Date</strong></th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {filteredList.map((agr, index) => (
                            <tr key={agr.id}>
                                <th scope='row'>{lastElementId = agr.id}</th>
                                <td>
                                    <Link to={'/agreement/' + index}>
                                        {agr.AgreementName}
                                    </Link>
                                </td>
                                <td>
                                    <MDBBadge color='success' pill>
                                        {agr.Status}
                                    </MDBBadge>
                                </td>
                                <td>{agr.AgreementType}</td>
                                <td>{agr.AccountName}</td>
                                <td>{agr.StartDate}</td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </div>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Agreement</Modal.Title>
                </Modal.Header>
                <Form onSubmit={onSave}>
                <Modal.Body>
                    
                        <Form.Group className="mb-3" controlId="exampleForm.ControlName">
                            <Form.Label>Agreement Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => { newAGRInputs.AgreementName = e.target.value }} autoFocus />
                        </Form.Group>
                        <div className='row'>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlType">
                                <Form.Label>Agreement Type</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={e => { newAGRInputs.AgreementType = e.target.value }}>
                                    <option>None</option>
                                    <option value="MSA">MSA</option>
                                    <option value="NDA">NDA</option>
                                    <option value="SLA">SLA</option>
                                    <option value="SOW">SOW</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={e => { newAGRInputs.Status = e.target.value }}>
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
                            <Form.Control type="text" onChange={e => onHandleChange('AccountName',e.target.value)} autoFocus />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlContact">
                            <Form.Label>Primary Contact</Form.Label>
                            <Form.Control type="text" onChange={e => { newAGRInputs.PrimaryContact = e.target.value }} autoFocus />
                        </Form.Group>
                        <div className='row'>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control type="date" onChange={e => { newAGRInputs.StartDate = e.target.value }} autoFocus />
                            </Form.Group>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput3">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control type="date" onChange={e => { newAGRInputs.EndDate = e.target.value }} autoFocus />
                            </Form.Group>
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <MDBBtn color="secondary" onClick={handleClose}>
                        Close
                    </MDBBtn>
                    <MDBBtn>
                        Save
                    </MDBBtn>
                </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );


}

export default Agreement;