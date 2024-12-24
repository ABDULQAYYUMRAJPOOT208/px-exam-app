// pages/api/socket.ts
import { Server } from "socket.io";

let io: Server | null = null;

export default function handler(req: any, res: any) {
    if (!io) {
        io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log("New client connected:", socket.id);

            socket.on("report-tab-switch", (data) => {
                console.log("Tab switch reported:", data);
                // Broadcast to teacher
                if (io) {

                    io.emit("student-tab-switch", data);
                }
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });
    }
    res.end();
}
