import React from "react";

const Supplier = () => {

    const gotoCreate = () => {
        window.location.href = "/create";
    }

    const gotoCreateMedcine = () => {
        window.location.href = "/create_medicine";
    }

    const gotoGenerateSecurityCode = () => {
        window.location.href = "/generate_security_code";
    }

    const gotoCheckOrder = () => {
        window.location.href = "/check_order";
    }

    const gotoCheckDemandOrder = () => {
        window.location.href = "/check_demand_order_supplier";
    }

    const gotoCheckCode = () => {
        window.location.href = "/check_code";
    }

    const gotoPredicate = () => {
        window.location.href = "/predicate=supplier";
    }
    
    const gotoSupplierInventory = () => {
        window.location.href = "/supplier_inventory";
    }

    return (
        <div>
            <div className="p-5 mb-4 bg-body-tertiary rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Create order</h1>
                    <p className="col-md-8 fs-4">When you click the button, you will be given the opportunity to register your drug information on our platform. This will make your drug information easily viewable and understandable by a wide range of users.</p>
                    <button className="btn btn-primary btn-lg" type="button" onClick={gotoCreate}>Create it now</button>
                </div>
            </div>
            <div className="row align-items-md-stretch">
                <div className="col-md-6">
                    <div className="h-100 p-5 text-bg-dark rounded-3">
                        <h2>Create Medicine</h2>
                        <p>Add the medicines you produce to your inventory.</p>
                        <button className="btn btn-outline-light" type="button" onClick={gotoCreateMedcine}>Create Medicine</button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="h-100 p-5 bg-body-tertiary border rounded-3">
                        <h2>Generate security code</h2>
                        <p>Allow your users to track your medications and ensure their effectiveness.</p>
                        <button className="btn btn-outline-secondary" type="button" onClick={gotoGenerateSecurityCode}>Generate security code</button>
                    </div>
                </div>
            </div>
            <div className="row align-items-md-stretch">
                <div className="col-md-6">
                    <div className="h-100 p-5 bg-body-tertiary border rounded-3">
                        <h2>Check order</h2>
                        <p>Check the order you sent to the hospital.</p>
                        <button className="btn btn-outline-secondary" type="button" onClick={gotoCheckOrder}>Check order</button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="h-100 p-5 text-bg-dark rounded-3">
                        <h2>Check demand order</h2>
                        <p>Check what the hospital requires of you.</p>
                        <button className="btn btn-outline-light" type="button" onClick={gotoCheckDemandOrder}>Check demand order</button>
                    </div>
                </div>
            </div>
            <div className="row align-items-md-stretch">
                <div className="col-md-6">
                    <div className="h-100 p-5 text-bg-dark rounded-3">
                        <h2>check anti-counterfeiting code</h2>
                        <p>Check that your medicines are genuine.</p>
                        <button className="btn btn-outline-secondary" type="button" onClick={gotoCheckCode}>check anti-counterfeiting code</button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="h-100 p-5 bg-body-tertiary border rounded-3">
                        <h2>Predicate Order</h2>
                        <p>Forecast your orders based on your historical orders</p>
                        <button className="btn btn-outline-secondary" type="button" onClick={gotoPredicate}>Predicate Order</button>
                    </div>
                </div>
            </div>
            <div className="p-5 mb-4 bg-body-tertiary rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Supplier Inventory</h1>
                    <p className="col-md-8 fs-4">Check your inventory.</p>
                    <button className="btn btn-primary btn-lg" type="button" onClick={gotoSupplierInventory}>Check it now</button>
                </div>
            </div>
        </div>


    );
}

export default Supplier;

