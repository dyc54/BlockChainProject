import React from "react";
import { useState } from "react";

const CheckCode = () => {
    const [code, setCode] = useState("");
    const [med_name, setMed_name] = useState("");
    function check(e) {
        e.preventDefault();
        fetch("http://localhost:8080/verify_AntiCounterfeitCode?med_name=" + med_name + "&antiCounterfeitCode=" + code, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    alert("It is a real medicine");
                } else {
                    alert("It is a fake medicine");
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
                <h1 className="h3 mb-3 fw-normal">Check code</h1>
                <div className="mb-3">
                    <label className="form-label">code</label>
                    <input type="text" className="form-control" placeholder="code" onChange={(e) => setCode(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Medicine Name</label>
                    <input type="text" className="form-control" placeholder="Medicine Name" onChange={(e) => setMed_name(e.target.value)} />
                </div>
                <br />
                <button className="btn btn-success" onClick={check}>Check</button>
                <br />
            </form>
        </div>
    );
}

export default CheckCode;
