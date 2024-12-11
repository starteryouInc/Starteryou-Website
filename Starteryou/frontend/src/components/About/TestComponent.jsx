import { useState, useEffect } from "react";
import axios from "axios";
import { API_CONFIG } from "../../config/api";

const TestComponent = () => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ name: "", value: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    setError("");
    console.log("Fetching records from the API...");
    try {
      const response = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.testApi}`
      );
      console.log("Records fetched successfully:", response.data);
      setRecords(response.data);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Failed to fetch records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async () => {
    if (!newRecord.name || !newRecord.value) {
      setError("Name and value are required.");
      return;
    }

    setLoading(true);
    setError("");
    console.log("Adding a new record:", newRecord);
    try {
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.testApi}`,
        newRecord
      );
      console.log("Record added successfully:", response.data);
      setRecords([...records, response.data]);
      setNewRecord({ name: "", value: "" });
    } catch (err) {
      console.error("Error adding record:", err);
      setError("Failed to add record. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Test API</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      <div>
        <h2>Add Record</h2>
        <input
          type="text"
          placeholder="Name"
          value={newRecord.name}
          onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Value"
          value={newRecord.value}
          onChange={(e) =>
            setNewRecord({ ...newRecord, value: e.target.value })
          }
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={addRecord} style={{ padding: "5px 10px" }}>
          Add
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Records</h2>
        {records.length === 0 ? (
          <p>No records found. Add a new record to get started.</p>
        ) : (
          <ul>
            {records.map((record) => (
              <li key={record._id}>
                <strong>{record.name}</strong>: {record.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TestComponent;
