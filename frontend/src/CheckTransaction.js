import React from "react";
import { useState } from "react";

const CheckTransaction = () => {

    const [transactionId, setTransactionId] = useState("");

    function check(e) {
        e.preventDefault();
        fetch("http://localhost:8080/view_transaction?transactionId=" + transactionId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    alert("Check successful and Data is " + responseData.data);
                } else {
                    alert("Check failed");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    return (
        <div className="mycontainer">
            <form className="login-form">
                <h1 className="h3 mb-3 fw-normal">&#128138;</h1>
                <h1 className="h3 mb-3 fw-normal">Check transaction</h1>
                <div className="mb-3">
                    <label className="form-label">Transaction Id</label>
                    <input type="text" className="form-control" placeholder="Transaction Id" onChange={(e) => setTransactionId(e.target.value)} />
                </div>
                <br />
                <button className="btn btn-success" onClick={check}>Check</button>
                <br />
            </form>
        </div>
    );
}

export default CheckTransaction;
