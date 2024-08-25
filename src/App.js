import React, { useState } from "react";
import Select from "react-select";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate JSON
    try {
      JSON.parse(jsonInput);
    } catch (err) {
      alert("Invalid JSON input. Please correct it and try again.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch("YOUR_API_ENDPOINT/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonInput,
      });

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleFilterChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);

    const filteredData = selectedOptions
      .map((option) => {
        // Check if the selected key exists in the response object and has a valid array
        const valueArray = response[option.value] || [];
        return `${option.label}: ${valueArray.join(",")}`;
      })
      .join(", ");

    setFilteredResponse(filteredData);
  };

  return (
    <div className="container">
      <h1>API Input</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="json-input"
          type="text"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"data":["M","1","334","4","B"]}'
          disabled={loading} // Disable input during loading
        />
        <button
          className="submit-button"
          type="submit"
          disabled={loading} // Disable button during loading
        >
          {loading ? "Loading..." : "Submit"} {/* Show loading text */}
        </button>
      </form>

      {response && (
        <>
          <h2>Multi Filter</h2>
          <Select
            className="dropdown"
            options={[
              { value: "numbers", label: "Numbers" },
              { value: "alphabets", label: "Alphabets" },
              {
                value: "highest_lowercase_alphabet",
                label: "Highest Lowercase Alphabet",
              },
            ]}
            isMulti
            onChange={handleFilterChange}
            isDisabled={loading} // Disable select during loading
          />
          <div className="response-container">
            <h3>Filtered Response</h3>
            <p>{filteredResponse || "No matching data found."}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
