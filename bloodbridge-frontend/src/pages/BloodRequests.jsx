import { useEffect } from "react";

function BloodRequests() {

    useEffect(() => {
        console.log("Blood Requests Page Loaded");
    }, []);

    return (
        <h1>Blood Requests</h1>
    );
}

export default BloodRequests;
