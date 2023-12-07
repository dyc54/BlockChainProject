import React from "react";
import { useState } from "react";

const CreateDemandOrder = () => {
    const [supplierId, setSupplierId] = useState("");
    const [medName, setMedName] = useState("");
    const [quantity, setQuantity] = useState("");

    function create(e) {
        e.preventDefault();
        const data = {
            hospitalId: localStorage.getItem("id"),
            supplierId: supplierId,
            medName: medName,
            quantity: String(quantity),
            time: new Date().toLocaleString(),
        };
        fetch("http://localhost:8080/hospital/createDemandOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    alert("Create successful and order id is " + responseData.data);
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
                <h1 className="h3 mb-3 fw-normal">Create demand order</h1>
                <div className="mb-3">
                    <label className="form-label">Supplier Id</label>
                    <input type="text" className="form-control" placeholder="Supplier Id" onChange={(e) => setSupplierId(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Medicine Name</label>
                    <input type="text" className="form-control" placeholder="Medicine Name" onChange={(e) => setMedName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input type="number" className="form-control" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <br />
                <button className="btn btn-success" onClick={create}>Create</button>
                <br />
            </form>
        </div>
    );
}

export default CreateDemandOrder;