import React, { useContext, useEffect, useRef, useState } from "react";
import StatusActions from "../StatusActions";
import { Form } from "react-bootstrap";
import { DataContext } from "../../context/AppData";
import { NavLink } from "react-router-dom";
import axios from "axios";

const AddEstimateForm = () => {
  const { estimateItems } = useContext(DataContext);
  

  const [itemObj, setItemObj] = useState(estimateItems);
  const [date, setDate] = useState("2023-09-10");

  const [itemForm, setItemForm] = useState({
    Name: "",
    Qty: "",
    Description: "",
    Rate: "",
    tblEstimateItems: [],
  });

  const inputFile = useRef(null);
  const [Files, setFiles] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    EstimateData: {
        CustomerId: "",
        ServiceLocation: "",
        Email: "",
        EstimateNumber: "",
        IssueDate: "2023-09-10",
        EstimateNotes: "",
        ServiceLocationNotes: "",
        PrivateNotes: "",
        QBStatus: "",
        tblEstimateItems: [],
        // Other fields...
    },
    Files: [],
});
  const fetchCustomers = async () => {
    const response = await axios.get(
      "https://earthcoapi.yehtohoga.com/api/Customer/GetCustomersList"
    );
    try {
      setCustomers(response.data);
      //   console.log("Custommer list is", customers[1].CustomerName);
    } catch (error) {
      console.error("API Call Error:", error);
    }
  };

  const submitData = async () => {
    const postData = {
        EstimateData: {
            ...formData.EstimateData,
            tblEstimateItems: [...formData.EstimateData.tblEstimateItems, ...itemForm.tblEstimateItems],
        },
        Files: [...formData.Files, ...Files],
    };
    try {
      const response = await axios.post(
        "https://earthcoapi.yehtohoga.com/api/Estimate/AddEstimate",
        postData
      );

      if (response.status === 200) {
        console.log("Data submitted successfully:", response.data);
      } else {
        console.log("Error submitting data:", response.statusText);
      }
    } catch (error) {
      console.error("API Call Error:", error);
    }
};



  useEffect(() => {
    fetchCustomers();
  }, []);

  const addItem = (e) => {
    e.preventDefault();

    const newItem = {
      id: itemForm.tblEstimateItems.length + 1,
      Name: itemForm.Name,
      Description: itemForm.Description,
      Qty: Number(itemForm.Qty),
      Rate: Number(itemForm.Rate),
      Address: "", // Add a mechanism to capture this if needed
      CreatedBy: 2,
      EditBy: 2,
      isActive: true,
    };

    setItemForm((prevState) => ({
      ...prevState,
      tblEstimateItems: [...prevState.tblEstimateItems, newItem],
      Name: "",
      Qty: "",
      Description: "",
      Rate: "",
    }));
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const deleteItem = (id) => {
    const updatedArr = itemObj.filter((object) => {
      return object.id !== id;
    });
    setItemObj(updatedArr);
  };

  const addFile = () => {
    inputFile.current.click();
    console.log("Filesss are", Files);
  };

  const trackFile = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const newFile = {
        actualFile: uploadedFile,
        name: uploadedFile.name,
        caption: uploadedFile.name,
        date: new Date().toLocaleDateString(),
      };
      setFiles((prevFiles) => [...prevFiles, newFile]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    const updatedFormData = {
      ...formData,
      EstimateData: {
        ...formData.EstimateData,
        tblEstimateItems: [
          ...formData.EstimateData.tblEstimateItems,
          ...itemForm.tblEstimateItems,
        ],
      },
      Files: [...formData.Files, ...Files],
    };

    console.log("Updated formData within handleSubmit:", updatedFormData);
    setFormData(updatedFormData);
    submitData()
  };
  useEffect(() => {
    console.log("Updated formData is:", formData);
  }, [formData]);

  return (
    <div class="card">
      <div className="card-body">
        <div className="row">
          <div className="basic-form col-md-6">
            <div className="row">
              <div className="col-md-8 mb-3">
                <div className="row statusRow">
                  <StatusActions />
                </div>
              </div>
            </div>
            <form>
              <div className="row">
                <div className="mb-2 col-md-9">
                  <Form.Select
                    value={formData.CustomerId}
                    name="CustomerId" // This was changed
                    onChange={handleInputChange}
                    aria-label="Default select example"
                    id="inputState"
                    className="bg-white"
                  >
                    <option value="">Customer</option>{" "}
                    {/* Set value attribute to an empty string for default option */}
                    {customers.map((customer) => (
                      <option
                        key={customer.CustomerId}
                        value={customer.CustomerId}
                      >
                        {customer.CustomerId + " " + customer.CustomerName}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                {/* <Form.Select
                    aria-label="Default select example"
                    id="inputState"
                    className="bg-white"
                  >
                    <option value="Customer">Service Location</option>
                  </Form.Select> */}
                <div className="mb-4 col-md-9">
                  <input
                    value={formData.ServiceLocation}
                    name="ServiceLocation"
                    onChange={handleInputChange}
                    type="text"
                    className="form-control"
                    placeholder="Service Location"
                  />
                </div>
                {/* <div className="mb-3 col-md-9">
                  <Form.Select
                    aria-label="Default select example"
                    id="inputState"
                    className="bg-white"
                  >
                    <option value="Service Location">Contact</option>
                  </Form.Select>
                </div> */}
                <div className="mb-4 col-md-9">
                  <input
                    value={formData.Email}
                    name="Email"
                    onChange={handleInputChange}
                    type="text"
                    className="form-control"
                    placeholder="Example@gmail.com."
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="basic-form col-md-6">
            <form>
              <div
                className="row"
                style={{ display: "flex", justifyContent: "end" }}
              >
                <div className="mb-3 col-md-9">
                  <label className="form-label">Estimate No.</label>
                  <input
                    value={formData.EstimateNumber}
                    name="EstimateNumber"
                    onChange={handleInputChange}
                    type="text"
                    className="form-control"
                    placeholder="Estimate No."
                  />
                </div>
                <div className="mb-3 col-md-9">
                  <label className="form-label">Issued Date</label>
                  <input
                    value={formData.IssueDate}
                    name="IssueDate"
                    onChange={handleInputChange}
                    className="form-control input-limit-datepicker"
                    placeholder="Issued Date"
                    type="date"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* add item modal */}
        <div className="modal fade" id="basicModal">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form onSubmit={addItem}>
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
                    <div className="mb-3 row">
                      <label className="col-sm-3 col-form-label">Name</label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          value={itemForm.Name}
                          onChange={handleChange}
                          name="Name"
                          className="form-control"
                          placeholder="Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label className="col-sm-3 col-form-label">
                        Quantity
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="number"
                          value={itemForm.Qty}
                          onChange={handleChange}
                          name="Qty"
                          className="form-control"
                          placeholder="Quantity"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label className="col-sm-3 col-form-label">
                        Description
                      </label>
                      <div className="col-sm-9">
                        <textarea
                          className="form-txtarea form-control"
                          value={itemForm.Description}
                          onChange={handleChange}
                          name="Description"
                          rows="3"
                          id="comment"
                        ></textarea>
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label className="col-sm-3 col-form-label">Rate</label>
                      <div className="col-sm-9">
                        <input
                          type="number"
                          value={itemForm.Rate}
                          onChange={handleChange}
                          name="Rate"
                          className="form-control"
                          placeholder="Rate"
                          required
                        />
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
                        <h5 style={{ margin: "0" }}>$100.00</h5>{" "}
                        {/* This value should probably be calculated based on Rate and quantity */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    id="closer"
                    className="btn btn-danger light"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
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
              <button
                className="btn btn-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#basicModal"
                style={{ margin: "12px 20px" }}
              >
                + Add Items
              </button>
              <div className="table-responsive active-projects style-1">
                <table id="empoloyees-tblwrapper" className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Qty / Duration</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Rate</th>
                      <th>Amount</th>
                      <th>Approved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemForm.tblEstimateItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.quantity}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.Rate}</td>
                        <td>{item.amount}</td>
                        <td>{item.approved ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Files */}
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
                + Add File
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
                      <th>File Name</th>
                      <th>Caption</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Files.map((file, index) => (
                      <tr key={index}>
                        <td>{file.name}</td>
                        <td>{file.caption}</td>
                        <td>{file.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="estNotesBox">
          <div className="row">
            <div className="col-lg-5">
              <div className="row">
                <div className="col-xl-12 col-lg-12">
                  <div className="basic-form">
                    <form>
                      <h4 className="card-title">Estimate Notes</h4>
                      <div className="mb-3">
                        <textarea
                          value={formData.EstimateNotes}
                          name="EstimateNotes"
                          onChange={handleInputChange}
                          className="form-txtarea form-control"
                          rows="2"
                        ></textarea>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-xl-12 col-lg-12">
                  <div className="basic-form">
                    <form>
                      <h4 className="card-title">Service Location Notes</h4>
                      <div className="mb-3">
                        <textarea
                          value={formData.ServiceLocationNotes}
                          name="ServiceLocationNotes"
                          onChange={handleInputChange}
                          className="form-txtarea form-control"
                          rows="2"
                        ></textarea>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-xl-12 col-lg-12">
                  <div className="basic-form">
                    <form>
                      <h4 className="card-title">Private Notes</h4>
                      <div className="mb-3">
                        <textarea
                          value={formData.PrivateNotes}
                          name="PrivateNotes"
                          onChange={handleInputChange}
                          className="form-txtarea form-control"
                          rows="2"
                        ></textarea>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card" style={{ marginTop: "15px" }}>
                <div className="card-body">
                  <div className="sutotalBox">
                    <div className="basic-form">
                      <form>
                        <Form.Select
                          value={formData.QBStatus}
                          name="QBStatus"
                          onChange={handleInputChange}
                          aria-label="Default select example"
                          id="inputState"
                          className="bg-white"
                        >
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                        </Form.Select>
                      </form>
                    </div>
                    <div className="dataBox">
                      <div className="dataRow">
                        <h5>Subtotal:</h5>
                        <p>10.00$</p>
                      </div>
                      <div className="dataRow">
                        <h5>Tax:</h5>
                        <p>0.00$</p>
                      </div>
                      <div className="dataRow">
                        <h5>Total:</h5>
                        <p>10.00$</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-2 row text-end">
          <div className="flex-right">
            <button
              type="button"
              class="btn btn-primary me-1"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <NavLink to="/Dashboard/Estimates">
              <button class="btn btn-danger light ms-1">Cancel</button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEstimateForm;
