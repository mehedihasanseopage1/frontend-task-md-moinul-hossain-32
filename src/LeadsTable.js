import React, { useState, useEffect } from 'react';

const LeadsTable = () => {
// Data fetch from API

const itemsPerPage = 10;
  const [leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://erp.seopage1.net/api/leads');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setLeads(data.data);
        } else {
          throw new Error('Data received is not in the expected format');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally handle the error state here
      }
    };

    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leads.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(leads.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


// Chart
const [dealStatusBatches, setDealStatusBatches] = useState([]);

  useEffect(() => {
    const calculateDealStatusBatches = () => {
      const batches = [];
      for (let i = 0; i < leads.length; i += 25) {
        const batch = leads.slice(i, i + 25);
        const dealStatusOneCount = batch.filter((item) => item.deal_status === 1).length;
        if (dealStatusOneCount > 0) {
          batches.push({
            startIndex: i + 1,
            endIndex: i + 25,
            count: dealStatusOneCount,
          });
        }
      }
      setDealStatusBatches(batches);
    };

    calculateDealStatusBatches();
  }, [leads]);





//   checkbox
const [checkedItems, setCheckedItems] = useState({
    id: true, // Default all checkboxes to true for initial display
    project_type: true,
    project_link: true,
    actual_value: true,
    country: true,
    client_name: true,
    deadline: true,
    deal_status: true,
  });

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckedItems({ ...checkedItems, [id]: checked });
  };



  

  return (
    <div className='my-5'>
        <div className='d-flex justify-content-between'>
            <h2>Leads Table</h2>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-list-task"></i>
                </button>
                
                <ul class="dropdown-menu px-3">
                    {Object.keys(checkedItems).map((key) => (
                        <li key={key}>
                            <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id={key}
                                checked={checkedItems[key]}
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor={key}>
                                {key}
                            </label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      
      <table className='table table-bordered' id="tableOne">
        <thead>
          <tr>
            {Object.keys(checkedItems).map((key) => {
              if (checkedItems[key]) {
                return <th key={key}>{key}</th>;
              }
              return null;
            })}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(leads) && leads.length > 0 ? (
            currentItems.map((lead) => (
            
                <tr key={lead?.id}>
                    {Object.keys(checkedItems).map((key) => {
                    if (checkedItems[key]) {

                        if (key === 'deal_status') {
                            // Apply color based on deal_status value
                            const dealStatusValue = lead[key.toLowerCase()];
                            return (
                              <td key={key} className={dealStatusValue === 1 ? 'text-success' : 'text-danger'}>
                                {/* {dealStatusValue} */}
                              </td>
                            );
                        }
                        return <td key={key}>{lead[key.toLowerCase()]}</td>;

                    }
                    return null;
                    })}
                </tr>
             
            ))
          ) : (
            <tr>
              <td colSpan="3">No leads available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav className='pagination'>
        <ul className="pagination">
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${currentPage === pageNumber + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(pageNumber + 1)}>
                {pageNumber + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>


      {/* Display batches with deal_status = 1 */}
      <h3>------------------- Chart ----------------------</h3>
      <div className="batches-container">
        
        <ul className="batches-list">
          {dealStatusBatches.length > 0 ? (
            dealStatusBatches.map((batch, index) => (
              <li key={index} className='chart-li'>
                <p className="batch-label">
                  Items {batch.startIndex} to {batch.endIndex}:
                </p>
                <progress id="file" value={batch.count} max="10" className='progressBar'> </progress>
                <span className="batch-count">
                  {batch.count} Items are Converted to Deal.
                </span>
              </li>
            ))
          ) : (
            <p>No batches found with 'deal_status' = 1</p>
          )}
        </ul>
        <h3>Batches with 'deal_status' = 1 (Every 25 items)</h3>
      </div>
      
    </div>
  );
};

export default LeadsTable;
