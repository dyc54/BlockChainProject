import React from "react";

const Hospital = () => {

    const gotoCreateDemandOrder = () => {
        window.location.href = "/create_demand_order";
    }

    const gotoSellMedicine = () => {
        window.location.href = "/sell_medicine";
    }

    const gotoCheckCode = () => {
        window.location.href = "/check_code";
    }

    const gotoCheckOrder = () => {
        window.location.href = "/check_order";
    }

    const gotoCheckDemandOrder = () => {
        window.location.href = "/check_demand_order_hospital";
    }

    const gotoCheckTransaction = () => {
        window.location.href = "/check_transaction";
    }

    const gotoPredicate = () => {
        window.location.href = "/predicate=hospital";
    }
    
    const gotoHospitalInventory = () => {
        window.location.href = "/hospital_inventory";
    }

    return (
        <div>
            <div className="p-5 mb-4 bg-body-tertiary rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Create demand order</h1>
                    <p className="col-md-8 fs-4">Create demand order to your suppliers so they can see it. Our platform will track your order in real time.</p>
                    <button className="btn btn-primary btn-lg" type="button" onClick={gotoCreateDemandOrder}>Create it now</button>
                </div>
            </div>
            <div className="row align-items-md-stretch">
                <div className="col-md-6">
                    <div className="h-100 p-5 text-bg-dark rounded-3">
                        <h2>Sell Medicine</h2>
                        <p>Buy medicine for your patients</p>
                        <button className="btn btn-outline-light" type="button" onClick={gotoSellMedicine}>Sell Medicine</button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="h-100 p-5 bg-body-tertiary border rounded-3">
                        <h2>check anti-counterfeiting code</h2>
                        <p>Check that your medicines are genuine.</p>
                        <button className="btn btn-outline-secondary" type="button" onClick={gotoCheckCode}>check anti-counterfeiting code</button>
                    </div>
                </div>
            </div>
            <div className="row align-items-md-stretch">
                <div className="col-md-6">
                    <div className="h-100 p-5 bg-body-tertiary border rounded-3">
                        <h2>Check order</h2>
                        <p>Review the orders the supplier sent to you.</p>
                        <button className="btn btn-outline-secondary" type="button" onClick={gotoCheckOrder}>Check order</button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="h-100 p-5 text-bg-dark rounded-3">
                        <h2>Check demand order</h2>
                        <p>View the orders you sent to your supplier.</p>
                        <button className="btn btn-outline-light" type="button" onClick={gotoCheckDemandOrder}>Check demand order</button>
                    </div>
                </div>
            </div>
            <div className="row align-items-md-stretch">
                <div className="col-md-6">
                    <div className="h-100 p-5 text-bg-dark rounded-3">
                        <h2>Check transaction</h2>
                        <p>Check the transaction you made.</p>
                        <button className="btn btn-outline-light" type="button" onClick={gotoCheckTransaction}>Check transaction</button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="h-100 p-5 bg-body-tertiary border rounded-3">
                        <h2>Predicate Order</h2>
                        <p>Forecast your orders based on your historical orders</p>
                        <button className="btn btn-outline-secondary" type="button" onClick={gotoPredicate}>predicate</button>
                    </div>
                </div>
            </div>
            <div className="p-5 mb-4 bg-body-tertiary rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Hospital Inventory</h1>
                    <p className="col-md-8 fs-4">Check your inventory.</p>
                    <button className="btn btn-primary btn-lg" type="button" onClick={gotoHospitalInventory}>Check it now</button>
                </div>
            </div>
        </div>
        
    );
}

export default Hospital;