import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MessagePopup({ adminId }) {

    const [organizers, setOrganizers] = useState([]);

    useEffect(() => {

        axios.get("http://localhost:8080/api/organizers")
            .then(res => {
                setOrganizers(res.data);
            })

    }, [])

    return (

        <div className="message-popup">

            <h3>Messages</h3>

            {organizers.map(o => (
                <div key={o.id} className="user-item">
                    {o.name}
                </div>
            ))}

        </div>

    )
}