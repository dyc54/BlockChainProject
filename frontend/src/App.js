import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import Forgetpassword from './forget_password';
import Supplier from './Supplier';
import Patient from './Patient';
import Hospital from './Hospital';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cover from './Cover';
import Create from './CreateOrderForHospital';
import CreateMedicine from './CreateMedicine';
import GenerateSecurityCode from './GenerateSecurityCode';
import CheckOrder from './CheckOrder';
import CheckCode from './CheckCode';

import CheckTransaction from './CheckTransaction';
import CreateDemandOrder from './CreateDemandOrder';
import SellMedicine from './SellMedicine';
import BuyMedicine from './BuyMedicine';

import CheckDemandOrderHospital from './CheckDemandOrderHospital';
import CheckDemandOrderSupplier from './CheckDemandOrderSupplier';

import PredicateHospital from './PredicateHospital';
import PredicateSupplier from './PredicateSupplier';
import SupplierInventory from './SupplierInventory';
import HospitalInventory from './HospitalInventory';

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Cover />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<Forgetpassword />} />
          <Route path="/user=supplier" element={<Supplier />} />
          <Route path="/user=patient" element={<Patient />} />
          <Route path="/user=hospital" element={<Hospital />} />
          <Route path="/create" element={<Create />} />
          <Route path="/create_medicine" element={<CreateMedicine />} />
          <Route path="/generate_security_code" element={<GenerateSecurityCode />} />
          <Route path="/check_order" element={<CheckOrder />} />
          <Route path="/check_code" element={<CheckCode />} />

          <Route path='check_transaction' element={<CheckTransaction />} />

          <Route path='/create_demand_order' element={<CreateDemandOrder />} />
          <Route path='/sell_medicine' element={<SellMedicine />} />
          <Route path='/buy_medicine' element={<BuyMedicine />} />
          <Route path='/check_demand_order_hospital' element={<CheckDemandOrderHospital />} />
          <Route path='/check_demand_order_supplier' element={<CheckDemandOrderSupplier />} />
        
          <Route path="/predicate=supplier" element={<PredicateSupplier />} />
          <Route path="/predicate=hospital" element={<PredicateHospital />} />
          <Route path="/supplier_inventory" element={<SupplierInventory />} />
          <Route path="/hospital_inventory" element={<HospitalInventory />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;