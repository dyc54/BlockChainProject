import React from "react";
import { useState } from "react";

const GenerateSecurityCode = () => {
    const [quantity, setQuantity] = useState("");
    const [seed, setSeed] = useState("");

    function create(e) {
        e.preventDefault();
        const data = {
            quantity: String(quantity),
            seed: seed,
        };
        fetch("http://localhost:8080/supplier/generateCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    alert("Create successful");
                } else {
                    alert("Create failed");
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
                <h1 className="h3 mb-3 fw-normal">Generate security code</h1>
                <div className="mb-3">
                    <label className="form-label">quantity of security code</label>
                    <input type="number" className="form-control" placeholder="quantity of security code" onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">seed</label>
                    <input type="text" className="form-control" placeholder="seed" onChange={(e) => setSeed(e.target.value)} />
                </div>
                <br />
                <button className="btn btn-success" onClick={create}>Create</button>
                <br />
            </form>
        </div>
    );
}

export default GenerateSecurityCode;
