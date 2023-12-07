import React from "react";
import { useState } from "react";

const CreateMedicine = () => {

    const [med_name, setMedName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [manufacturer, setManufacturer] = useState("");
    const [expiryDate, setExpireDate] = useState("");
    const [location, setLocation] = useState("");

    function create(e) {
        e.preventDefault();
        const data = {
            manufacturer: manufacturer,
            expiryDate: expiryDate,
            med_name: med_name,
            quantity: String(quantity),
            supplierId: localStorage.getItem("id"),
            location: location,
        };
        fetch("http://localhost:8080/supplier/createProduct", {
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
                <h1 className="h3 mb-3 fw-normal">Create medicine</h1>
                <div className="mb-3">
                    <label className="form-label">Medicine Name</label>
                    <input type="text" className="form-control" placeholder="MedicineName" onChange={(e) => setMedName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Manufacturer</label>
                    <input type="text" className="form-control" placeholder="Manufacturer" onChange={(e) => setManufacturer(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">quantity of medicine</label>
                    <input type="number" className="form-control" placeholder="quantity of medicine" onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Expiry Date</label>
                    <input type="date" className="form-control" placeholder="Expiry Date" onChange={(e) => setExpireDate(e.target.value)} />
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

export default CreateMedicine;