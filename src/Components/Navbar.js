import React, { useState } from 'react';
import { FaTable, FaColumns } from "react-icons/fa";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBIcon
} from 'mdb-react-ui-kit';

function Navbar() {
  const [showNav, setShowNav] = useState(false);

  return (
    <MDBNavbar expand='lg' dark bgColor='primary' className='fixed-top'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='#' className='StrongText'>
            <img src="https://documentation.conga.com/_/7F0000010174D99BC1C4A45E6F35588A/1676351021000/Conga_HeaderLogo.png" height="30" alt=''/>
            RLP
        </MDBNavbarBrand>
        <MDBNavbarToggler
        type='button' aria-expanded='false' aria-label='Toggle navigation' 
        onClick={() => setShowNav(!showNav)} >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>
        <MDBCollapse navbar show={showNav}>
          <MDBNavbarNav>
            <MDBNavbarItem>
              <MDBNavbarLink aria-current='page' className={window.location.pathname==='/' ? 'active' : ''} 
              href='/'>
                <FaTable />  Agreement
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/proposal' className={window.location.pathname==='/proposal' ? 'active' : ''} >
                <FaColumns/> Proposal
              </MDBNavbarLink>
            </MDBNavbarItem>
            {/* <MDBNavbarItem>
              <MDBNavbarLink disabled href='#' tabIndex={-1} aria-disabled='true'>
                Disabled
              </MDBNavbarLink>
            </MDBNavbarItem> */}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default Navbar;