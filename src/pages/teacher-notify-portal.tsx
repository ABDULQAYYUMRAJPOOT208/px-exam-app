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

    // return (
    //     // <div>
    //     //     <h1>Teacher Portal</h1>
    //     //     {notifications && notifications.map((notify) => (
    //     //         <div key={notify.rollNumber}>
    //     //             <p>Student with roll number {notify.rollNumber} has changed the tab!</p>
    //     //         </div>
    //     //     ))}
    //     // </div>
    //     <div className="p-6">
    //         <h1 className="text-3xl font-semibold mb-6 text-center">Teacher Portal</h1>

    //         <p className="text-gray-500 text-lg mb-6 text-center">
    //             This list shows the roll numbers of students who have switched tabs during their exams. It helps track
    //             students' activity and ensures that they remain focused during the examination period.
    //         </p>

    //         {notifications && notifications.length > 0 ? (
    //             notifications.map((notify) => (
    //                 <div
    //                     key={notify.rollNumber}
    //                     className="bg-[#b22222] text-white p-4 px-6 rounded-lg shadow-lg mb-4 flex items-center"
    //                 >
    //                     <p className="text-lg font-medium">
    //                         Student with roll number{" "}
    //                         <span className="font-bold text-blue-500">{notify.rollNumber}</span> has changed the tab!
    //                     </p>
    //                 </div>
    //             ))
    //         ) : (
    //             <p className="text-gray-400">No notifications available.</p>
    //         )}
    //     </div>

    // );


    return (
        <div className="p-2">
            <div className="flex flex-col justify-center items-center">
                <div className="exam-header flex flex-col justify-center items-center">
                    <h1 className="my-20 text-4xl font-bold text-zinc-800 dark:text-white text-center">
                        Teacher Portal
                    </h1>
                    <p className="text-center text-zinc-600 dark:text-zinc-400 w-1/1.5">
                        List of the students who switched their tabs during exams
                    </p>
                </div>
            </div>

            {notifications && notifications.length > 0 ? (
                notifications.map((notify) => (
                    <div
                        key={notify.rollNumber}
                        className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mb-4 flex items-center mt-8"
                    >
                        <p className="text-lg font-medium">
                            Student with roll number{" "}
                            <span className="font-bold text-blue-500">{notify.rollNumber}</span> has changed the tab!
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-gray-400">No notifications available.</p>
            )}
        </div>
    );

};

export default TeacherPortal;
