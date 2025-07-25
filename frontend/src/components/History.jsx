import React, { useEffect, useState } from "react";
import axios from "axios";
import './style.css';


const History = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http:192.168.1.6:4000/api/calllogs");
        setLogs(response.data);
      } catch (error) {
        console.error("Failed to fetch call logs:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="history-container">
      <h2>Call History</h2>
      {logs.length === 0 ? (
        <p>No call logs found.</p>
      ) : (
        <table className="call-log-table">
          <thead>
            <tr>
              <th>Caller</th>
              <th>Receiver</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.caller}</td>
                <td>{log.reciever}</td>
                <td>{new Date(log.startTime).toLocaleString()}</td>
                <td>{new Date(log.endTime).toLocaleString()}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
