import React, { useState } from "react";
import Select from "react-select";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bfhl`, {
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
    }
  };

  const handleFilterChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);

    const filteredData = selectedOptions
      .map((option) => {
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
        />
        <button className="submit-button" type="submit">
          Submit
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
          />
          <div className="response-container">
            <h3>Filtered Response</h3>
            <p>{filteredResponse}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
