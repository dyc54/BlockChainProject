import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SupplierInventory = () => {
    const navigate = useNavigate();
    function back() {
        navigate('/user=supplier');
    }
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/supplier/supplierinventory?supplierId=" + localStorage.getItem("id"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    responseData.data = responseData.inventory.replace(/\//g, "");
                    responseData.data = JSON.parse(responseData.data);
                    setData(responseData.data);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            }
            );
    }, []);

    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Medicine Name</th>
                        <th scope="col">Manufacturer</th>
                        <th scope="col">Expiry Date</th>
                        <th scope="col">AntiCounterfeit Code</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Location</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item) => {
                        return (
                            <tr key={item.Key}>
                                <td>{item.Record.name}</td>
                                <td>{item.Record.manufacturer}</td>
                                <td>{item.Record.expiryDate}</td>
                                <td>{item.Record.antiCounterfeitCode}</td>
                                <td>{item.Record.owner}</td>
                                <td>{item.Record.location}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button className='btn btn-success' onClick={back}>Back</button>
        </div>
    );
}

export default SupplierInventory;
