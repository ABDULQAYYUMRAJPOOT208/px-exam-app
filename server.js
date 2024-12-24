const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);

    // Initialize Socket.IO after Next.js prepares
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // Update with your frontend's URL if needed
            methods: ['GET', 'POST'],
        },
    });

    // Array to keep track of students who are allowed to resume the exam
    let studentsAllowedToResume = [];

    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        // Listen for tab-changed event from the student
        socket.on('tab-changed', (data) => {
            console.log('Tab change detected:', data);
            socket.broadcast.emit('tab-changed', data); // Notify others (teacher, etc.)
        });

        // Listen for allow-resume event from the teacher
        socket.on('allow-resume', (data) => {
            console.log(`Teacher allowed student ${data.rollNumber} to resume`);

            // Add the student's roll number to the list of allowed students
            studentsAllowedToResume.push(data.rollNumber);

            // Notify the specific student that they are allowed to resume
            io.emit('allow-resume', { rollNumber: data.rollNumber });
        });

        // Cleanup when a user disconnects
        socket.on('disconnect', () => {
            console.log('A user disconnected', socket.id);
        });
    });

    // Next.js custom routing to handle all requests
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    // Start the server on port 3001
    httpServer.listen(3001, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3001');
    });
});
