function Dashboard() {

    const donor = JSON.parse(localStorage.getItem("donor"));

    return (
        <div>
            <h1>Donor Dashboard</h1>

            <h3>Welcome {donor.fullName}</h3>
        </div>
    );
}

export default Dashboard;
