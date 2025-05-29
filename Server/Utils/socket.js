const io = require("socket.io")();
module.exports = io;

// import { io } from "socket.io-client";
// let socket = io("https://event-flow-api.onrender.com");

// let [attendees, setAttendees] = useState([]);

// useEffect(() => {
//     socket.on("attendance", attendees => {
//         setAttendees(attendees);
//     });
// }, [attendees]);
