import React, {useState} from 'react';
import {MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBBtn, MDBBtnGroup,
    MDBTabs, MDBTabsItem, MDBTabsLink, MDBTabsContent, MDBTabsPane, MDBSpinner,
    MDBListGroup, MDBListGroupItem,
    MDBTable, MDBTableHead, MDBTableBody} from 'mdb-react-ui-kit';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { ComposerAPI } from '../Services/Composer-api';

export default function ProposalDetails(props) {
    const [basicActive, setBasicActive] = useState('tab1');
    const {id}= useParams();
    let recordDetails= props.proposal[id];

    const handleBasicClick = (value) => {
        if (value === basicActive) {
            return;
        }
        setBasicActive(value);
    };

    const [lineItems, setLineItems]= useState(props.proposal[id].ProposalLineItems);
    function onRemoveLine(index) {
        setLineItems(currentLineItems => currentLineItems.filter((lineItems, i) => i !== index));
        console.log('PLIs: '+JSON.stringify(lineItems));
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let newLineItem= {
        id: null,
        ProductName: '',
        ProductType: '',
        Description: '',
        ListPrice: 0,
        Quantity: 0,
        NetPrice: 0
    }
    let lastElementId= null;
    
    function onSaveLine(event) {
        event.preventDefault();
        newLineItem.id= lastElementId+1;
        newLineItem.NetPrice= newLineItem.ListPrice*newLineItem.Quantity;
        console.log(JSON.stringify(newLineItem));
        setLineItems((prevLineItems)=> {
            return [...prevLineItems, newLineItem];
        });
        handleClose();
    }

    function onComposerAPI() {
        setIsLoading(true);
        recordDetails.ProposalLineItems= lineItems;
        ComposerAPI(recordDetails, 'aA28a000000M0OaCAK', setIsLoading);
    }

    const [isLoading, setIsLoading] = useState(false);

    return(
        <div className='margin-top container'>
            <MDBCard>
                <MDBCardHeader>
                <div className='d-flex justify-content-between'>
                    <MDBTabs className='mb-3'>
                        <MDBTabsItem>
                            <MDBTabsLink onClick={() => handleBasicClick('tab1')} active={basicActive === 'tab1'}>
                                <strong>Proposal Details</strong>
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem>
                            <MDBTabsLink onClick={() => handleBasicClick('tab2')} active={basicActive === 'tab2'}>
                                <strong>Proposal Line Items</strong>
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>

                    <div>
                        <MDBBtnGroup shadow='0' aria-label='Basic example'>
                            <MDBBtn color='danger' onClick={onComposerAPI} className={isLoading ? 'disabled' : ''} outline>
                                <strong>
                                    {isLoading ? <div><MDBSpinner role='status' color='danger' size='sm' className='me-2' />Generating....</div>: 
                                    'Generate Proposal'}
                                </strong>
                            </MDBBtn>
                            <MDBBtn color='danger' outline>
                                <strong>Send for Signature</strong>
                            </MDBBtn>
                        </MDBBtnGroup>
                    </div>
                </div>
                </MDBCardHeader>
                <MDBCardBody>
                    <MDBCardText>
                        <MDBTabsContent>
                            <MDBTabsPane show={basicActive === 'tab1'}>
                                <MDBListGroup light className='mb-4'>
                                <div style={{ minWidth: '22rem' }}>
                                    <MDBListGroup light className='mb-4'>          
                                        <MDBListGroupItem className='d-flex justify-content-between align-items-center row'>
                                            <div className='d-flex align-items-center col-6'>
                                                <div className='ms-3 labelLeft'>
                                                <div className='fw-bold mb-1'>Proposal Name</div>
                                                <div className='text-muted mb-0'>{props.proposal[id].ProposalName}</div>
                                                </div>
                                            </div>
                                            <div className='d-flex align-items-center col-6'>
                                                <div className='ms-3 labelLeft'>
                                                <div className='fw-bold mb-1'>Primary Contact</div>
                                                <div className='text-muted mb-0'>{props.proposal[id].PrimaryContact}</div>
                                                </div>
                                            </div>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem className='d-flex justify-content-between align-items-center row'>
                                            <div className='d-flex align-items-center    col-6'>
                                                <div className='ms-3 labelLeft'>
                                                <div className='fw-bold mb-1'>Account</div>
                                                <div className='text-muted mb-0'>{props.proposal[id].AccountName}</div>
                                                </div>
                                            </div>
                                            <div className='d-flex align-items-center col-6'>
                                                <div className='ms-3 labelLeft'>
                                                <div className='fw-bold mb-1'>Status</div>
                                                <div className='text-muted mb-0'>{props.proposal[id].Status}</div>
                                                </div>
                                            </div>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem className='d-flex justify-content-between align-items-center row'>
                                            <div className='d-flex align-items-center col-6'>
                                                <div className='ms-3 labelLeft'>
                                                <div className='fw-bold mb-1'>Proposal Start Date</div>
                                                <div className='text-muted mb-0'>{props.proposal[id].StartDate}</div>
                                                </div>
                                            </div>
                                            <div className='d-flex align-items-center col-6'>
                                                <div className='ms-3 labelLeft'>
                                                <div className='fw-bold mb-1'>Opportunity</div>
                                                <div className='text-muted mb-0'>{props.proposal[id].Opportunity}</div>
                                                </div>
                                            </div>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem className='d-flex justify-content-between align-items-center row'>
                                            <div className='d-flex align-items-center col-6'>
                                                <div className='ms-3 labelLeft'>
                                                <div className='fw-bold mb-1'>Proposal End Date</div>
                                                <div className='text-muted mb-0'>{props.proposal[id].EndDate}</div>
                                                </div>
                                            </div>
                                            <div className='d-flex align-items-center col-6'></div>
                                        </MDBListGroupItem>
                                    </MDBListGroup>
                                    </div>
                                </MDBListGroup>
                            </MDBTabsPane>
                            <MDBTabsPane show={basicActive === 'tab2'}>
                                <MDBTable align='middle'>
                                    <MDBTableHead>
                                        <tr>
                                            <th scope='col'><strong>Line No</strong></th>
                                            <th scope='col'><strong>Product</strong></th>
                                            <th scope='col'><strong>Product Description</strong></th>
                                            <th scope='col'><strong>List Price</strong></th>
                                            <th scope='col'><strong>Quantity</strong></th>
                                            <th scope='col'><strong>Net Price</strong></th>
                                            <th scope='col'>
                                                <MDBBtn color='success' onClick={handleShow} outline>
                                                    <strong>New</strong>
                                                </MDBBtn>
                                            </th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {lineItems.map((PLI, index) => (
                                            <tr key={PLI.id}>
                                                <td>{lastElementId=PLI.id}</td>
                                                <td>
                                                    <div className='fw-bold mb-1'>{PLI.ProductName}</div>
                                                    <div className='text-muted mb-0'>{PLI.ProductType}</div>
                                                </td>
                                                <td>
                                                    {PLI.Description}
                                                </td>
                                                <td>$ {PLI.ListPrice}</td>
                                                <td>{PLI.Quantity}</td>
                                                <td>$ {PLI.NetPrice}</td>
                                                <td>
                                                    <MDBBtn color='link' rounded size='sm' 
                                                    onClick={() => onRemoveLine(index)} >
                                                        Remove
                                                    </MDBBtn>
                                                </td>
                                            </tr>
                                        ))}
                                    </MDBTableBody>
                                </MDBTable>
                            </MDBTabsPane>
                        </MDBTabsContent>
                    </MDBCardText>
                    <MDBBtn href='/proposal'>Back</MDBBtn>
                </MDBCardBody>
            </MDBCard>

            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Agreement Line Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control type="text" onChange={(e)=> {newLineItem.ProductName= e.target.value} } autoFocus />
                        </Form.Group>
                        <div className='row'>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlType">
                                <Form.Label>Product Type</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={e=>{newLineItem.ProductType= e.target.value}}>
                                    <option>None</option>
                                    <option value="Smartphone">Smartphone</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Smartwatch">Smartwatch</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlStatus">

                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlAccount">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="textarea" onChange={e=>{newLineItem.Description= e.target.value}} autoFocus />
                        </Form.Group>
                        <div className='row'>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput3">
                                <Form.Label>List Price</Form.Label>
                                <Form.Control type="number" onChange={e=>{newLineItem.ListPrice= e.target.value}} autoFocus />
                            </Form.Group>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control type="number" onChange={e=>{newLineItem.Quantity= e.target.value}} autoFocus />
                            </Form.Group>

                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <MDBBtn color="secondary" onClick={handleClose}>
                    Close
                </MDBBtn>
                <MDBBtn onClick={onSaveLine}>
                    Save
                </MDBBtn>
                </Modal.Footer>
            </Modal>
        </div>
    );
}