import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');  // Connect to your custom server

const TeacherPortal = () => {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        socket.on('tab-changed', (data) => {
            console.log("Student cheating: ", data);
            setNotifications(prevNotifications => [...prevNotifications, data]);  // Use previous state to add new notification
            // alert(`Student with roll number ${data.rollNumber} has changed the tab!`);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('tab-changed');
        };
    }, []);

    return (
        <div>
            <h1>Teacher Portal</h1>
            {notifications && notifications.map((notify) => (
                <div key={notify.rollNumber}>
                    <p>Student with roll number {notify.rollNumber} has changed the tab!</p>
                </div>
            ))}
        </div>
    );
};

export default TeacherPortal;
