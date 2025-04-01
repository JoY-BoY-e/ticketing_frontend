import React, { useEffect, useState, useContext } from 'react';
import Head from './header.jsx';
import './CarRentalStyle.css';
import image from './ride.png';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';

function CarRental() {
    const [Cars, setCars] = useState([]);
    const auth = useContext(AuthContext);

    // Use environment variables
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_BASE_URL}/cars`)
            .then((response) => response.json())
            .then((json) => {
                setCars(json);
            })
            .catch((error) => {
                console.error('Error fetching car data:', error);
            });
    }, [API_BASE_URL]);

    const [city, setCity] = useState('');
    const [pickDate, setPickDate] = useState('');
    const [DropDate, setDropDate] = useState('');
    const [title, setTitle] = useState('');
    const [disp, setDisplay] = useState('none');

    const HandleBooking = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/carsTick`, {
                City: city,
                PickDate: pickDate,
                DropDate: DropDate,
                Price: 2000,
                Car: title,
                userID: auth.user.UserID
            });
            if (response.status === 201) {
                alert('Ticket Booked Successfully');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert('An error occurred. Please try again later.');
            }
        }
    };

    const ShowMenu = () => {
        setDisplay(disp === 'none' ? 'flex' : 'none');
    };

    return (
        <div>
            <Head />
            <main className="carRen-main">
                <form onSubmit={(e) => e.preventDefault()}>
                    <h1>Search for Cars</h1>
                    <h4>Find the best and most affordable cars</h4>
                    <div>
                        <label htmlFor="r1">Within_City<input id="r1" name="city" type="radio" /></label>
                        <label htmlFor="r2">OutSide_City<input id="r2" name="city" type="radio" /></label>
                    </div>
                    <select 
                        id="city" 
                        placeholder="City" 
                        aria-label="City" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)}
                    >
                        <option hidden value="">City</option>
                        <option value="14">Lahore</option>
                        <option value="16">Islamabad</option>
                        <option value="10">Multan</option>
                        <option value="6">Faisalabad</option>
                        <option value="15">Karachi</option>
                        <option value="8">Sargodha</option>
                        <option value="7">Sialkot</option>
                        <option value="5">Sahiwal</option>
                        <option value="11">Gujranwala</option>
                        <option value="13">Rahim-Yar-Khan</option>
                        <option value="9">Peshawar</option>
                        <option value="17">Jehlum</option>
                        <option value="18">Abbotabad</option>
                        <option value="19">Gujrat</option>
                        <option value="20">Sadiqabad</option>
                        <option value="22">Swat</option>
                        <option value="23">Mardan</option>
                        <option value="24">Mansehra</option>
                        <option value="25">Muzaffarabad</option>
                        <option value="26">Quetta</option>
                        <option value="27">Hyderabad</option>
                        <option value="28">Sukkur</option>
                    </select>
                    <label>PickUp Date</label>
                    <input 
                        id="pickupDate" 
                        type="date" 
                        placeholder="PickUp Date" 
                        value={pickDate} 
                        onChange={(e) => setPickDate(e.target.value)} 
                    />

                    <label>DropOff Date</label>
                    <input 
                        id="DropOffDate" 
                        type="date" 
                        value={DropDate} 
                        onChange={(e) => setDropDate(e.target.value)} 
                    />

                    {auth.isLoggedIn ? (
                        <button type="submit" onClick={ShowMenu}>Search</button>
                    ) : null}
                </form>

                <div className="container" style={{ display: disp }}>
                    {Cars.map((d) => (
                        <div className="box" key={d.title}>
                            <img src={d.link} alt={d.title} />
                            <h2>{d.title}</h2>
                            <button 
                                className="BoxButton" 
                                onClick={() => { 
                                    setTitle(d.title);
                                    HandleBooking();
                                }}
                            >
                                Book me
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default CarRental;
