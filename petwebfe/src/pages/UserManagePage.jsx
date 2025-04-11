import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserManagePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const changeUserStatus = async (userId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/users/${userId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user status.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h2>User Management</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Role</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>
              Status
            </th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {user.username}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {user.email}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {user.role.name}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {user.status}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                <button
                  onClick={() =>
                    changeUserStatus(
                      user._id,
                      user.status === false ? "true" : "false"
                    )
                  }
                  style={{
                    padding: "5px 10px",
                    backgroundColor: user.status === true ? "red" : "green",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {user.status === true ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
