import React , { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckDemandOrderSupplier() {
    const navigate = useNavigate();
    function back() {
        navigate('/user=supplier');
    }
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/supplier/getDemandOrders?supplierId=" + localStorage.getItem("id"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    responseData.data = responseData.data.replace(/\//g, "");
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
                        <th scope="col">HospitalId</th>
                        <th scope="col">Medicine Name</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Status</th>
                        <th scope="col">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item) => {
                        return (
                            <tr key={item.Record.supplierId}>
                                <td>{item.Record.hospitalId}</td>
                                <td>{item.Record.medicine_name}</td>
                                <td>{item.Record.quantity}</td>
                                <td>{item.Record.orderTime}</td>
                                <td>{item.Record.status}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button className='btn btn-success' onClick={back}>Back</button>
        </div>
    );
}
export default CheckDemandOrderSupplier;