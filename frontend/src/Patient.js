import React from "react";

const Patient = () => {
    const gotoBuyMedcine = () => {
        window.location.href = "/buy_medicine";
    }

    const gotoCheckTransaction = () => {
        window.location.href = "/check_transaction";
    }

    const gotoCheckCode = () => {
        window.location.href = "/check_code";
    }

    return (
        <div>
            <div className="p-5 mb-4 bg-body-tertiary rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Buy Medcine</h1>
                    <p className="col-md-8 fs-4">Purchase the order you want from the hospital you want.</p>
                    <button className="btn btn-primary btn-lg" type="button" onClick={gotoBuyMedcine}>Buy Medcine</button>
                </div>
            </div>
            <div className="row align-items-md-stretch">
                <div className="col-md-6">
                    <div className="h-100 p-5 text-bg-dark rounded-3">
                        <h2>Check transaction</h2>
                        <p>Check the order details of your purchase.</p>
                        <button className="btn btn-outline-light" type="button" onClick={gotoCheckTransaction}>Check transaction</button>
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
        </div>
        
    );
}

export default Patient;