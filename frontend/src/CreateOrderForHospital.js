import React from "react";
import { useState } from "react";

const Create = () => {

    const [hospitalId, setHospitalId] = useState("");
    const [medicineName, setMedicineName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [location, setLocation] = useState("");

    function create(e) {
        e.preventDefault();
        const data = {
            hospitalId: hospitalId,
            medName: medicineName,
            quantity: String(quantity),
            supplierId: localStorage.getItem("id"),
            time: new Date().toLocaleString(),
            location: location,
        };
        fetch("http://localhost:8080/supplier/createOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    alert("Create successful" + responseData.data);
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
                <h1 className="h3 mb-3 fw-normal">Create order for hospital</h1>
                <div className="mb-3">
                    <label className="form-label">Hospital Id</label>
                    <input type="text" className="form-control" placeholder="Hospital Id" onChange={(e) => setHospitalId(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Medicine Name</label>
                    <input type="text" className="form-control" placeholder="MedicineName" onChange={(e) => setMedicineName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">quantity of medicine</label>
                    <input type="number" className="form-control" placeholder="quantity of medicine" onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
                </div>
                <br />
                <button className="btn btn-success" onClick={create}>Create</button>
                <br />
            </form>
        </div>
    );
}

export default Create;