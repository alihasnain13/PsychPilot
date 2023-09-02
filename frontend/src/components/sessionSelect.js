import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from './loading';

const SessionList = ({ onSessionSelect }) => {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [emptySession, setEmptySession] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { logOut, user } = UserAuth();



    const sessionselection = () => {

        if (Object.keys(user).length === 0) {



        }
        else {

            return new Promise(async (resolve, reject) => {
                try {
                    setIsLoading(true)

                    user
                        .getIdToken(true)
                        .then(async (idToken) => {

                            let response = (await axios.post(
                                `http://localhost:3001/api/chathistory`,
                                {
                                    userID: user.uid,
                                },
                                {
                                    headers: {
                                        Authorization: "Bearer " + idToken,
                                    },
                                }
                            ));

                            if (Object.keys(response.data).length === 0  ) {

                                setEmptySession(true);
                                setIsLoading(false);

                            }
                            else {

                                setSessions(response.data);
                                setIsLoading(false);
                            }

                        })
                        .catch((error) => {
                            console.log("Error fetching ID Token:", error);
                            reject(error); // Reject the Promise if there's an error
                        });


                } catch (error) {
                    console.log("Error End Session:", error);
                    reject(error); // Reject the Promise if there's an error
                }
            });

        }
    };



    useEffect(() => {

        sessionselection();

    }, [user]);

    // Function to handle session selection
    const handleSessionSelect = (sessionID) => {
        setSelectedSession(sessionID);
        onSessionSelect(sessionID);
    };

    return (
        <div style={{ display: 'grid', alignContent: 'space-between', gridGap: '5vh' }}>
            <div style={{ width: '100%', borderBottom: '0.1px solid grey' }}>
                <h1 >Session List</h1>
            </div>

            <div>

                {isLoading ? (
                    <Loading />
                ) : (

                    <div class="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <table className="table table-hover tableFont" style={{ fontSize: '1.8rem' }} >
                            <thead >
                                <tr >
                                    <th className='tableHead' scope="col" >#</th>
                                    <th className='tableHead' scope="col" >Sessions</th>
                                    <th className='tableHead' scope="col" >Date</th>
                                    <th className='tableHead' scope="col" >Messages</th>
                                </tr>
                            </thead>
                            {emptySession ?

                                <tbody  >
                                    
                                        <td>No Sessions found</td>
                                    
                                </tbody>

                                :

                                <tbody  >
                                    {sessions.map((session, index) => (
                                        <tr key={session.docName} onClick={() => handleSessionSelect(session.docName)} style={{ cursor: 'pointer' }}>
                                            <td >{index + 1}</td>
                                            <th scope="row" >{session.docName}</th>
                                            <td >{new Date(session.created._seconds * 1000).toLocaleString()}</td>
                                            <td >{session.numMessages}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            }


                        </table>
                    </div>

                )}

            </div>

        </div >


    );
};

export default SessionList;
