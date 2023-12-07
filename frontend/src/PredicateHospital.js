import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PredicateSupplier = () => {
    const navigate = useNavigate();
    const [keys, setKeys] = useState("");
    function back() {
        navigate('/user=hospital');
    }
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/hospital/hospitaldemandforecasting?hospitalId=" + localStorage.getItem("id"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    responseData.data = responseData.demand.replace(/\//g, "");
                    responseData.data = JSON.parse(responseData.data);
                    setKeys(Object.keys(responseData.data));
                    setTimeout(() => {
                        console.log(data);
                    }, 1000);
                    setData(responseData.data);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            }
            );
    }
    , [keys, data]);

    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Medicine Name</th>
                        <th scope="col">Quantity</th>
                    </tr>
                </thead>
                <tbody>{keys && keys.map((item) => (
                    <tr key={item}>
                    <td>{item}</td>
                    <td>{data[item]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className='btn btn-success' onClick={back}>Back</button>
        </div>
    );

}

export default PredicateSupplier;
