import React, { useContext, useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import TitleBar from "../TitleBar";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Print, Email, Download  } from "@mui/icons-material";
// import { Autocomplete, TextField } from '@mui/material';

const UpdateSRForm = ({ serviceRequestId, setShowContent }) => {
  const [customers, setCustomers] = useState([]);

  const [sRList, setSRList] = useState({});

  const [SRData, setSRData] = useState({
    ServiceRequestData: {
      ServiceRequestId: serviceRequestId,

      CustomerId: 0,
      ServiceLocation: "",
      Contact: "",
      JobName: "",
      DueDate: "",
      SRTypeId: 0,
      SRStatusId: 0,
      Assign: "",
      WorkRequest: "",
      ActionTaken: "",
      CompletedDate: "",
      tblSRItems: [],
    },
  });

  const [itemInput, setItemInput] = useState({
    Name: "",
    Qty: null,
    Description: "",
    Rate: null,
  });
  const [tblSRItems, setTblSRItems] = useState([]);

  const [files, setFiles] = useState([]);
  const inputFile = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSRData((prevData) => ({
      ServiceRequestData: {
        ...prevData.ServiceRequestData,
        [name]:
          name === "CustomerId" || name === "SRTypeId" || name === "SRStatusId"
            ? Number(value)
            : value,
      },
    }));
    // console.log("object,,,,,,", SRData);
  };

  const submitHandler = async () => {
    const formData = new FormData();
    SRData.ServiceRequestData.tblSRItems = tblSRItems;

    formData.append(
      "ServiceRequestData",
      JSON.stringify(SRData.ServiceRequestData)
    );

    // formData.append(
    //   "ServiceRequestData",
    //   JSON.stringify(SRData.ServiceRequestData)
    // );
    files.forEach((fileObj) => {
      formData.append("Files", fileObj);
    });

    try {
      const response = await axios.post(
        "https://earthcoapi.yehtohoga.com/api/ServiceRequest/AddServiceRequest",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      console.log("payload izzzzzzz", formData);
      // Handle successful submission
      window.location.reload();
    } catch (error) {
      console.error("API Call Error:", error);
    }
    for (let [key, value] of formData.entries()) {
      console.log("filessss", key, value);
    }
  };

  const removeItem = (index) => {
    const newItems = [...tblSRItems];
    newItems.splice(index, 1);
    setTblSRItems(newItems);
  };

  const trackFile = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  const addFile = () => {
    inputFile.current.click();
  };
  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  useEffect(() => {
    const fetchSR = async () => {
      if(serviceRequestId === 0){return}
      const response = await axios.get(
        `https://earthcoapi.yehtohoga.com/api/ServiceRequest/GetServiceRequest?id=${serviceRequestId}`
      );
      try {
        setSRList(response.data);
        setSRData((prevData) => ({
          ServiceRequestData: {
            ...prevData.ServiceRequestData,
            CustomerId: response.data.CustomerId,
            ...response.data,
          },
        }));
        // Set the tblSRItems state with the response.data.tblSRItems
        setTblSRItems(response.data.tblSRItems);
        // Set the itemInput state with the first item from the response.data.tblSRItems
        if (response.data.tblSRItems && response.data.tblSRItems.length > 0) {
          setItemInput(response.data.tblSRItems[0]);
        }

        if (response.data.tblSRFiles) {
          setFiles((prevFiles) => [...prevFiles, ...response.data.tblSRFiles]);
        }
        console.log(" list is///////", response.data);
      } catch (error) {
        console.error("API Call Error:", error);
      }
    };

    const fetchCustomers = async () => {
      const response = await axios.get(
        "https://earthcoapi.yehtohoga.com/api/Customer/GetCustomersList"
      );
      try {
        setCustomers(response.data);
        console.log(customers);
      } catch (error) {
        console.error("API Call Error:", error);
      }
    };

    fetchSR();
    fetchCustomers();
  }, [serviceRequestId]);

  // useEffect(() => {
  //   fetchSR();
  //   fetchCustomers();
  // }, []);

  const icon = (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.64111 13.5497L9.38482 9.9837L12.5145 12.4421L15.1995 8.97684"
        stroke="#888888"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx="18.3291"
        cy="3.85021"
        rx="1.76201"
        ry="1.76201"
        stroke="#888888"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.6808 2.86012H7.01867C4.25818 2.86012 2.54651 4.81512 2.54651 7.57561V14.9845C2.54651 17.7449 4.22462 19.6915 7.01867 19.6915H14.9058C17.6663 19.6915 19.3779 17.7449 19.3779 14.9845V8.53213"
        stroke="#888888"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // fileAdd

  return (
    <>
      <div className="">
        <div className="">
          <div className="card-body">
            {/* Add service form */}
            <div className="row mb-3">
              <div className="col-lg-12 col-md-12 mb-2">
                <NavLink to="/Dashboard/Estimates">
                  {" "}
                  <button
                    type="button"
                    className="col-md-2 btn btn-sm btn-primary"
                  >
                    {" "}
                    + Add Estimate{" "}
                  </button>
                </NavLink>
                <button type="button" className="btn btn-sm btn-secondary mx-2">
                  + Add Invoice
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                >
                  <Email></Email>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary mx-2"
                >
                  <Print></Print>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                >
                  <Download></Download>
                </button>
              </div>
            </div>
            <div className="card">
              <div className="card-body p-0">
                <div className="itemtitleBar">
                  <h4>Service Request Details</h4>
                </div>{" "}
                <br />
                <div className="basic-form">
                  <div className="row">
                    <div className="col-xl-3 mb-2 col-md-9 ">
                      <label className="form-label">Customers</label>
                      <Form.Select
                        size="lg"
                        name="CustomerId"
                        onChange={handleInputChange}
                        value={SRData.ServiceRequestData.CustomerId || ""}
                        aria-label="Default select example"
                        id="inputState"
                        className="bg-white"
                      >
                        <option value="">Customer</option>{" "}
                        {customers.map((customer) => (
                          <option
                            key={customer.CustomerId}
                            value={customer.CustomerId}
                          >
                            {customer.CustomerName}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="col-xl-3 mb-2 col-md-9 ">
                      <label className="form-label">Servive Locations</label>
                      <Form.Select
                        size="lg"
                        name="CustomerId"
                        onChange={handleInputChange}
                        value={SRData.ServiceRequestData.CustomerId || ""}
                        aria-label="Default select example"
                        id="inputState"
                        className="bg-white"
                      >
                        <option value="">Service Location</option>{" "}
                        {customers.map((customer) => (
                          <option
                            key={customer.CustomerId}
                            value={customer.CustomerId}
                          >
                            {customer.CustomerName}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    {/* <div className="mb-3 col-md-4">
                      <label className="form-label">Service Location</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={SRData.ServiceRequestData.ServiceLocation || ''}
                        name="ServiceLocation"
                        onChange={handleInputChange}
                        placeholder={sRList.ServiceLocation || " "}
                      />
                    </div> */}
                    <div className="col-xl-3 mb-2 col-md-9 ">
                      <label className="form-label">Contacts</label>
                      <Form.Select
                        size="lg"
                        name="CustomerId"
                        onChange={handleInputChange}
                        value={SRData.ServiceRequestData.CustomerId || ""}
                        aria-label="Default select example"
                        id="inputState"
                        className="bg-white"
                      >
                        <option value="">Customer</option>{" "}
                        {customers.map((customer) => (
                          <option
                            key={customer.CustomerId}
                            value={customer.CustomerId}
                          >
                            {customer.CustomerName}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    {/* <div className="mb-3 col-md-4">
                      <label>Contact</label>
                      <input
                        type="text"
                        name="Contact"
                        value={SRData.ServiceRequestData.Contact || ''}
                        onChange={handleInputChange}
                        className="form-control form-control-sm"
                        placeholder={sRList.Contact || " "}
                      />
                    </div> */}
                    <div className="col-xl-3">
                      <label className="form-label">Job Name:</label>
                      <input
                        type="text"
                        name="JobName"
                        value={SRData.ServiceRequestData.JobName || ""}
                        onChange={handleInputChange}
                        className="form-control form-control-sm"
                        placeholder={sRList.JobName || " "}
                      />
                    </div>
                  </div>

                  <div className="row  mt-2 mb-2">
                    <div className=" col-xl-3 col-md-4">
                      <label className="form-label">Due Date:</label>

                      <input
                        type="date"
                        name="DueDate"
                        value={SRData.ServiceRequestData.DueDate || ""}
                        onChange={handleInputChange}
                        className="form-control form-control-sm"
                        placeholder={sRList.DueDate || " "}
                      />
                    </div>
                    <div className="col-xl-3 col-md-4">
                      <label className="form-label">Type:</label>
                      <Form.Select
                        name="SRTypeId"
                        value={SRData.ServiceRequestData.SRTypeId || ""}
                        onChange={handleInputChange}
                        size="lg"
                        className="bg-white"
                      >
                        <option value={null}>Inspect and Advise</option>
                        <option value="Irrigation">Irrigation</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Other">Other</option>
                        <option value="Proposal Needed">Proposal Needed</option>
                        <option value="Tree Care">Tree Care</option>
                      </Form.Select>
                    </div>
                    <div className="col-xl-3 ">
                      <label className="form-label">Notes</label>
                      <textarea
                        name="WorkRequest"
                        value={SRData.ServiceRequestData.WorkRequest || ""}
                        onChange={handleInputChange}
                        className="form-txtarea form-control form-control-sm"
                        placeholder={sRList.WorkRequest || " "}
                        rows="2"
                      ></textarea>
                    </div>
                    <div className="col-lg-2 col-md-2 ">
                      <label className="form-label">Status:</label>
                      <Form.Select
                        name="SRStatusId"
                        value={SRData.ServiceRequestData.SRStatusId || ""}
                        onChange={handleInputChange}
                        size="lg"
                        className="bg-white"
                      >
                        <option value={1}>Open</option>
                        <option value={2}>Closed</option>
                      </Form.Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Assign and scedule */}
            <div className="card">
              <div className="card-body p-0 pb-4">
                <div className="itemtitleBar">
                  <h4>Assign & Schedule</h4>
                </div>
                <br />
                <div className="basic-form">
                  <div className="row">
                    <div className="col-md-4">
                      {" "}
                      {/* Adjust the column size as needed */}
                      <label className="form-label">
                        Assign / Appointment:
                      </label>
                      <Form.Select
                        name="Assign"
                        size="lg"
                        className="bg-white"
                        value={SRData.ServiceRequestData.Assign || ""}
                      >
                        <option value={null}>Choose...</option>
                        <option value="option 1">option 1</option>
                        <option value="option 2">option 2</option>
                        <option value="option 3">option 3</option>
                      </Form.Select>
                    </div>
                    <div className="col-md-6 pt-4">
                      {" "}
                      {/* Adjust the column size as needed */}
                      <button className="btn schedule-btn">Schedule</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* modal */}
            <div className="modal fade" id="basicModal">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Item</h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="basic-form">
                      <form>
                        <div className="mb-3 row">
                          <label className="col-sm-3 col-form-label">
                            Name
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              name="Name"
                              value={itemInput.Name}
                              onChange={(e) =>
                                setItemInput({
                                  ...itemInput,
                                  Name: e.target.value,
                                })
                              }
                              className="form-control form-control-sm"
                              placeholder="Name"
                            />
                          </div>
                        </div>
                        

                        <div className="mb-3 row">
                          <label className="col-sm-3 col-form-label">
                            Staff
                          </label>
                          <div className="col-sm-9">
                          <Form.Select
                        name="Assign"
                        size="md"
                        className="bg-white"
                       
                      >
                        <option value={null}>Choose...</option>
                        <option value="option 1">option 1</option>
                        <option value="option 2">option 2</option>
                        <option value="option 3">option 3</option>
                      </Form.Select>
                          </div>
                        </div>

                        <div className="mb-3 row">
                          <label className="col-sm-3 col-form-label">
                            Quantity
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="number"
                              name="Qty"
                              value={itemInput.Qty}
                              onChange={(e) =>
                                setItemInput({
                                  ...itemInput,
                                  Qty: Number(e.target.value),
                                })
                              }
                              className="form-control form-control-sm"
                              placeholder="Quantity"
                            />
                          </div>
                        </div>
                        <div className="mb-3 row">
                          <label className="col-sm-3 col-form-label">
                            Description
                          </label>
                          <div className="col-sm-9">
                            <textarea
                              name="Description"
                              className="form-txtarea form-control form-control-sm"
                              value={itemInput.Description}
                              onChange={(e) =>
                                setItemInput({
                                  ...itemInput,
                                  Description: e.target.value,
                                })
                              }
                              rows="3"
                              id="comment"
                            ></textarea>
                          </div>
                        </div>
                        <div className="mb-3 row">
                          <label className="col-sm-3 col-form-label">
                            Rate
                          </label>
                          <div className="col-sm-9">
                            <input
                              name="Rate"
                              type="number"
                              value={itemInput.Rate}
                              onChange={(e) =>
                                setItemInput({
                                  ...itemInput,
                                  Rate: Number(e.target.value),
                                })
                              }
                              className="form-control form-control-sm"
                              placeholder="Rate"
                            />
                          </div>
                        </div>

                        <div className="mb-3 row">
                          <label className="col-sm-3 col-form-label">
                            Tax
                          </label>
                          <div className="col-sm-9">
                          <Form.Select
                        name="Tax"
                        size="md"
                        className="bg-white"
                       
                      >
                        
                        <option value="option 1">Non (Non-Taxable Sales)</option>
                        <option value="option 2">Tax (Taxable Sales)</option>
                        <option value="option 3">LBR (Non-Taxable Labour)</option>
                      </Form.Select>
                          </div>
                        </div>
                        <div className="mb-3 row">
                          <label className="col-sm-3 col-form-label">
                            
                          </label>
                          <div className="col-sm-9">
                          <input
                            type="checkbox"
                            name="isPrimary"
                            className="form-check-input"
                            id="customCheckBox"
                            
                          />

                          <label
                            className="form-check-label"
                            htmlFor="customCheckBox"
                          >
                           Billable
                          </label>
                          </div>
                        </div>

                        <div className="row">
                          <label className="col-sm-3 col-form-label">
                            Item Total
                          </label>
                          <div
                            className="col-sm-9"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <h5 style={{ margin: "0" }}>{itemInput.Rate * itemInput.Qty}</h5>

                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-danger light"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setTblSRItems([...tblSRItems, itemInput]);
                        setItemInput({
                          Name: "",
                          Qty: 0,
                          Description: "",
                          Rate: 0,
                        }); // Reset the modal input fields
                      }}
                      data-bs-dismiss="modal"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* item table */}
            <div className="card">
              <div className="card-body p-0">
                <div className="estDataBox">
                  <div className="itemtitleBar">
                    <h4>Items</h4>
                  </div>
                  <NavLink
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#basicModal"
                    style={{ margin: "12px 20px" }}
                  >
                    + Add Items
                  </NavLink>
                  <div className="table-responsive active-projects style-1">
                    <table id="empoloyees-tblwrapper" className="table">
                      <thead>
                        <tr>
                          <th>Qty / Duration</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Rate</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tblSRItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.Qty}</td>
                            <td>{item.Name}</td>
                            <td>{item.Description}</td>
                            <td>{item.Rate}</td>
                            <td>{item.Qty * item.Rate}</td>
                            <td>
                              <div className="badgeBox">
                                <span
                                  className="actionBadge badge-danger light border-0 badgebox-size"
                                  onClick={() => removeItem(index)}
                                >
                                  <span className="material-symbols-outlined badgebox-size">
                                    delete
                                  </span>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* files */}
            <div className="card">
              <div className="card-body p-0">
                <div className="estDataBox">
                  <div className="itemtitleBar">
                    <h4>Files</h4>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ margin: "12px 20px" }}
                    onClick={addFile}
                  >
                    + Add
                  </button>
                  <input
                    type="file"
                    ref={inputFile}
                    onChange={trackFile}
                    style={{ display: "none" }}
                  />
                  <div className="table-responsive active-projects style-1">
                    <table id="empoloyees-tblwrapper" className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>File Name</th>
                          <th>Last Modified Date</th>
                          <th>Type</th>
                          <th>Size</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {files.map((file, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{file.FileName || file.name}</td>
                            <td></td>
                            <td>{file.type || "N/A"}</td>
                            <td>{file.size} bytes</td>
                            <td>
                              <div className="badgeBox">
                                <span
                                  className="actionBadge badge-danger light border-0 badgebox-size"
                                  onClick={() => removeFile(index)}
                                >
                                  <span className="material-symbols-outlined badgebox-size">
                                    delete
                                  </span>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* Details */}
            <div className="card">
              <div className="card-body p-0 pb-4">
                <div className="itemtitleBar">
                  <h4>Details</h4>
                </div>
                <br />
                <div className="basic-form">
                  <div className="row">
                    <div className="col-md-4">
                      {" "}
                      {/* Adjust the column size as needed */}
                      <label className="form-label">Work Requested:</label>
                      <textarea
                        name="WorkRequest"
                        value={SRData.ServiceRequestData.WorkRequest || ""}
                        onChange={handleInputChange}
                        className="form-txtarea form-control form-control-sm"
                        placeholder={sRList.WorkRequest || " "}
                        rows="2"
                      ></textarea>
                    </div>
                    <div className="col-md-4 ">
                      {" "}
                      <label className="form-label">Action Taken:</label>
                      {/* Adjust the column size as needed */}
                      <textarea
                        name="ActionTaken"
                        value={SRData.ServiceRequestData.ActionTaken || ""}
                        onChange={handleInputChange}
                        className="form-txtarea form-control form-control-sm"
                        placeholder={sRList.ActionTaken || " "}
                        rows="2"
                      ></textarea>
                    </div>

                    <div className=" col-md-4">
                      <label className="form-label">Date Completed:</label>

                      <input
                        type="date"
                        name="CompletedDate"
                        value={SRData.ServiceRequestData.CompletedDate || ""}
                        onChange={handleInputChange}
                        className="form-control form-control-sm"
                        placeholder={sRList.CompletedDate || " "}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ;
          </div>

          <div className="mb-2 row text-end">
            <div className="flex-right">
              <button
                type="button"
                className="btn btn-primary me-1"
                onClick={submitHandler}
              >
                Submit
              </button>

              <button
                className="btn btn-danger light ms-1"
                onClick={() => {
                  setShowContent(true);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        {/* <div>{sRList}</div> */}
      </div>
    </>
  );
};

export default UpdateSRForm;
