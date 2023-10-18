import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const AddCustomer = () => {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loginState, setLoginState] = useState("dontallow");
  const [showLogin, setShowLogin] = useState(false);
  const [primary, setPrimary] = useState(true);

  const [formData, setFormData] = useState({
    CustomerData: {
      CustomerName: "",
    },
    ContactData: [],
  });

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://earthcoapi.yehtohoga.com/api/Customer/GetCustomer?id=5"
      );
      const keys = Object.keys(response.data);
      console.log(keys);
    } catch (error) {
      console.log("API Call Error:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://earthcoapi.yehtohoga.com/api/Customer/AddCustomer",
        {
          CustomerData: {
            CustomerName: formData.CustomerData.CustomerName,
          },
          ContactData: contacts.map((contact) => ({
            FirstName: contact.FirstName,
            LastName: contact.LastName,
            Email: contact.Email,
            Phone: contact.Phone,
            CompanyName: contact.CompanyName,
            Address: contact.Address,
            isPrimary: contact.isPrimary,
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API response:", response.data);

      setFormData({
        CustomerData: {
          CustomerName: "",
        },
        ContactData: [],
      });

      setContacts([]); // Clear the contacts array

      navigate("/Dashboard/Customers");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the formData state with the changed value
    setFormData({
      ...formData,
      ContactData: {
        ...formData.ContactData,
        [name]: value,
      },
    });
  };
  const addContact = (e) => {
    e.preventDefault();

    const newContact = {
      FirstName: formData.ContactData.FirstName,
      LastName: formData.ContactData.LastName,
      Email: formData.ContactData.email,
      Phone: formData.ContactData.phone,
      CompanyName: formData.ContactData.CompanyName,
      Address: formData.ContactData.Address,
      isPrimary: primary,
    };

    setContacts([...contacts, newContact]);

    // Clear the form fields
    setFormData(prevState => ({
      ...prevState,
      ContactData: {
        FirstName: "",
        LastName: "",
        Email: "",
        Phone: "",
        CompanyName: "",
        Address: "",
      },
    }));

    setPrimary(true);
  };

  const deleteContact = (index) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts);
  };

  useEffect(() => {
    if (loginState === "allow") {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }, [loginState]);

  return (
    <div className="container-fluid">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="card">
          <div className="card-header">
            <h4 className="modal-title" id="#gridSystemModal">
              Customer Info
            </h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-xl-4 mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Customer Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="customerName"
                  id="exampleFormControlInput1"
                  placeholder="Customer Name"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <form onSubmit={addContact}>
        <div className="card">
          <div className="card-header">
            <h4 className="modal-title" id="#gridSystemModal">
              Contact
            </h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-xl-4 mb-3">
                    <label className="form-label">
                      First Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      onChange={handleChange}
                      name="FirstName"
                      className="form-control"
                      placeholder="First Name"
                      required
                    />
                  </div>

                  <div className="col-xl-4 mb-3">
                    <label className="form-label">
                      Last Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      onChange={handleChange}
                      name="LastName"
                      className="form-control"
                      placeholder="Last Name"
                      required
                    />
                  </div>

                  <div className="col-xl-4 mb-3">
                    <label className="form-label">
                      Email<span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      id="contactInp2"
                      className="form-control"
                      onChange={handleChange}
                      name="email"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="col-xl-4 mb-3">
                    <label className="form-label">
                      Phone<span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      id="contactInp3"
                      onChange={handleChange}
                      name="phone"
                      className="form-control"
                      placeholder="Phone"
                    />
                  </div>
                  <div className="col-xl-4 mb-3">
                    <label className="form-label">
                      Company Name<span className="text-danger">*</span>
                    </label>
                    <input
                      id="contactInp4"
                      onChange={handleChange}
                      name="CompanyName"
                      className="form-control"
                      placeholder="Company Name"
                      required
                    />
                  </div>
                  <div className="col-xl-4 mb-3">
                    <label className="form-label">
                      Address<span className="text-danger">*</span>
                    </label>
                    <input
                      onChange={handleChange}
                      name="Address"
                      className="form-control"
                      placeholder="Address"
                      required
                    />
                  </div>
                  <div className="row">
                    <label className="col-form-label col-form-label-lg">
                      Set as Primary
                    </label>
                    <div className="mb-3 mb-0">
                      <form>
                        <div className="form-check custom-checkbox form-check-inline">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="customCheckBox"
                            checked={primary}
                            onChange={() => setPrimary(!primary)}
                          />

                          <label
                            className="form-check-label"
                            htmlFor="customCheckBox"
                          >
                            Set as Primary
                          </label>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div
                    className="col-xl-4 mb-3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "26px",
                    }}
                  >
                    <button className="btn btn-primary">Add</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body p-0">
                  <div className="estDataBox">
                    <div className="itemtitleBar">
                      <h4>Contacts</h4>
                    </div>
                    <div className="table-responsive active-projects style-1">
                      <table id="empoloyees-tblwrapper" className="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company Name</th>
                            <th>Address</th>
                            <th>Primary</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map((contact, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{contact.FirstName}</td>
                              <td>{contact.LastName}</td>
                              <td>{contact.Email}</td>
                              <td>{contact.Phone}</td>
                              <td>{contact.CompanyName}</td>{" "}
                              {/* Corrected this line */}
                              <td>{contact.Address}</td>
                              <td>{contact.isPrimary ? "Yes" : "No"}</td>{" "}
                              {/* Corrected this line */}
                              <td>
                                <div className="badgeBox">
                                  <span
                                    className="actionBadge badge-danger light border-0"
                                    onClick={() => deleteContact(index)}
                                  >
                                    <span className="material-symbols-outlined">
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
            </div>
          </div>
        </div>
      </form>

      {/* Contacts Table */}

      <div className="text-end">
        <button className="btn btn-primary me-1" onClick={handleSubmit}>
          Submit
        </button>
        <NavLink to="/Dashboard/Customers">
          <button className="btn btn-danger light ms-1">Cancel</button>
        </NavLink>
      </div>
    </div>
  );
};

export default AddCustomer;
