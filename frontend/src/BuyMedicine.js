import React from "react";
import { useState } from "react";

const BuyMedicine = () => {
    const [med_name, setMed_name] = useState("");
    const [quantity, setQuantity] = useState("");
    const [hospitalId, setHospitalId] = useState("");
    const [location, setLocation] = useState("");
    function buy(e) {
        e.preventDefault();
        const data = {
            med_name: med_name,
            quantity: String(quantity),
            hospitalId: hospitalId,
            time: new Date().toLocaleString(),
            patientId: localStorage.getItem("id"),
            location: location,
        };
        fetch("http://localhost:8080/patient/sellMedication", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    alert("Buy successful and your order id is " + responseData.data);
                } else {
                    alert("Buy failed");
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
                <h1 className="h3 mb-3 fw-normal">Buy medicine</h1>
                <div className="mb-3">
                    <label className="form-label">Medicine Name</label>
                    <input type="text" className="form-control" placeholder="Medicine Name" onChange={(e) => setMed_name(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input type="number" className="form-control" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Hospital Id</label>
                    <input type="text" className="form-control" placeholder="Hospital Id" onChange={(e) => setHospitalId(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
                </div>
                <br />
                <button className="btn btn-success" onClick={buy}>Buy</button>
                <br />
            </form>
        </div>
    );
}

export default BuyMedicine;