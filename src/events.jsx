import React, { useEffect, useState, useContext } from 'react';
import './events.css';
import Head from './header.jsx';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';

function Event() {
    const [events, setEvents] = useState([]);
    const [search1, setSearch] = useState('All');
    const auth = useContext(AuthContext);

    // Use environment variable for the API base URL
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        handleSearch();
    }, []);

    const handleText = (e) => {
        setSearch(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            const json = await response.json();

            if (search1 === "All") {
                setEvents(json);
            } else {
                const result = json.filter((m) => 
                    m.event_location.toLowerCase().includes(search1.toLowerCase())
                );
                setEvents(result);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    function BookingApp({ title, location, className }) {
        const [count, setCount] = useState(0);
        const [disp, setDisplay] = useState('none');

        const IncCount = () => setCount(count + 1);
        const DecCount = () => setCount(count > 0 ? count - 1 : 0);

        const HandleBooking = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/eventTick`, {
                    Title: title,
                    Location: location,
                    Price: count * 1000,
                    Tickets: count,
                    userID: auth.user.UserID,
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
            setDisplay(disp === 'none' ? 'block' : 'none');
        };

        return (
            <div>
                {auth.isLoggedIn ? (
                    <button
                        style={{
                            backgroundColor: 'lightgray',
                            color: 'black',
                            padding: '5px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '10px',
                        }}
                        onClick={ShowMenu}
                    >
                        Book Me
                    </button>
                ) : null}
                <div className={className} style={{ display: disp }}>
                    <button onClick={DecCount}>-</button>
                    <input 
                        type="number" 
                        value={count} 
                        onChange={(e) => setCount(Number(e.target.value))} 
                        min="0" 
                    />
                    <button onClick={IncCount}>+</button>
                    <button className="BookButton" onClick={HandleBooking}>
                        Book
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Head />
            <main>
                <div>
                    <br />
                    <br />
                    <form className="moviesSearchForm" onSubmit={handleSubmit}>
                        <select name="city" value={search1} onChange={handleText}>
                            <option value="All">Select City</option>
                            <option value="Lahore">Lahore</option>
                            <option value="Karachi">Karachi</option>
                            <option value="Islamabad">Islamabad</option>
                            <option value="Rawalpindi">Rawalpindi</option>
                            <option value="Pir Chinasi">Pir Chinasi</option>
                        </select>
                        <button onClick={handleSearch}>Search</button>
                    </form>
                </div>
                <br />
                <hr />
                <div className="posters">
                    <br />
                    {events.map((event) => (
                        <div className="post2" key={event.title}>
                            <img src={event.link} height="400px" width="400px" alt={event.title} />
                            <h3>{event.title}</h3>
                            <BookingApp title={event.title} location={event.event_location} className="bookingBox" />
                        </div>
                    ))}
                </div>
            </main>
            <hr />
            <footer>
                <br />
                <h4>
                    <b> BOOK MOVIE TICKETS ONLINE...</b>
                </h4>
                <p>
                    Tickethub provides online movie ticket booking services for numerous cinemas across major cities of Pakistan. With Tickethub, you have the convenience of checking movie schedules at various theaters, reviewing live seating arrangements to choose your preferred seats, and even watching movie trailers directly on our platform. Say goodbye to long queues and the fear of missing out on your favorite movie; Tickethub ensures you never miss a show, allowing you to enjoy hassle-free movie experiences.
                </p>
                <h4>BUYING METHODS...</h4>
                <p>
                    Bookme offers different methods of payment to buy event tickets online. Some of the methods to pay for event tickets are mentioned below:
                    <ul>
                        <li>JazzCash</li>
                        <li>EasyPaisa</li>
                        <li>Credit/Debit card</li>
                    </ul>
                </p>
            </footer>
        </div>
    );
}

export default Event;
