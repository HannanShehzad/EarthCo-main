import React, { useContext, useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Form } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";

export const AddPO = ({ setShowContent }) => {
  const [formData, setFormData] = useState({});
  const [customersList, setCustomersList] = useState([]);
  const [showCustomersList, setShowCustomersList] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [sLList, setSLList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSL, setSelectedSL] = useState(null);

  const handleAutocompleteChange = async (e) => {
    // inputValue ? setDisableSubmit(false) : setDisableSubmit(true);
    setInputValue(e.target.value);
    if (!e.target.value) {
      return;
    }
    try {
      setShowCustomersList(true); // Show the list when typing
      const res = await axios.get(
        `https://earthcoapi.yehtohoga.com/api/Customer/GetSearchCustomersList?Search=${e.target.value}`
      );
      console.log("customers search list", res.data);
      setCustomersList(res.data);
    } catch (error) {
      console.log("customer search api error", error);
    }
  };
  const selectCustomer = (customer) => {
    setFormData({ ...formData, CustomerId: customer.UserId });

    setInputValue(customer.CompanyName); // Add this line to update the input value
    setShowCustomersList(false);
  };

  const fetchServiceLocations = async (id) => {
    if (!id) {
      return;
    }
    axios
      .get(
        `https://earthcoapi.yehtohoga.com/api/Customer/GetCustomerServiceLocation?id=${id}`
      )
      .then((res) => {
        setSLList(res.data);
        console.log("service locations are", res.data);
      })
      .catch((error) => {
        setSLList([]);
        console.log("service locations fetch error", error);
      });
  };

  const fetctContacts = async (id) => {
    if (!id) {
      return;
    }
    axios
      .get(
        `https://earthcoapi.yehtohoga.com/api/Customer/GetCustomerContact?id=${id}`
      )
      .then((res) => {
        console.log("contacts data isss", res.data);
        setContactList(res.data);
      })
      .catch((error) => {
        setContactList([]);
        console.log("contacts data fetch error", error);
      });
  };

  const handleSLAutocompleteChange = (event, newValue) => {
    const simulatedEvent = {
      target: {
        name: "ServiceLocationId",
        value: newValue ? newValue.ServiceLocationId : "",
      },
    };

    handleInputChange(simulatedEvent);
  };

  const handleContactAutocompleteChange = (event, newValue) => {
    const simulatedEvent = {
      target: {
        name: "ContactId",
        value: newValue ? newValue.ContactId : "",
      },
    };

    handleInputChange(simulatedEvent);
  };

  const handleInputChange = (e, newValue) => {
    const { name, value } = e.target;

    setSelectedCustomer(newValue);
    setSelectedSL(newValue);

    // Convert to number if the field is CustomerId, Qty, Rate, or EstimateStatusId

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleChange = (e) => {
    // Extract the name and value from the event target
    const { name, value } = e.target;

    // Create a new copy of formData with the updated key-value pair
    const updatedFormData = { ...formData, [name]: value };

    // Update the formData state
    setFormData(updatedFormData);
  };

  useEffect(() => {
    fetchServiceLocations(formData.CustomerId);
    fetctContacts(formData.CustomerId);
    console.log("main payload isss", formData);
  }, [formData]);

  // items

  const [itemsList, setItemsList] = useState([]);
  const [itemInput, setItemInput] = useState({
    Name: "",
    Qty: 1,
    Description: "",
    Rate: null,
  });
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItem, setShowItem] = useState(true);
  const inputRef = useRef(null);
  const token = Cookies.get("token");

  useEffect(() => {
    if (searchText) {
      // Make an API request when the search text changes
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .get(
          `https://earthcoapi.yehtohoga.com/api/Item/GetSearchItemList?Search=${searchText}`,
          { headers }
        )
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) => {
          console.error("Error fetching itemss data:", error);
        });
    } else {
      setSearchResults([]); // Clear the search results when input is empty
    }
  }, [searchText]);

  const handleItemChange = (event) => {
    setShowItem(true);
    setSearchText(event.target.value);

    setSelectedItem(null); // Clear selected item when input changes
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSearchText(item.ItemName); // Set the input text to the selected item's name
    setItemInput({
      ...itemInput,
      Name: item.ItemName,
      Description: item.SaleDescription,
      Rate: item.SalePrice,
    });
    setShowItem(false);
    setSearchResults([]); // Clear the search results

    console.log("selected item is", itemInput);
  };

  const deleteItem = (id) => {
    const updatedItemsList = itemsList.filter((item) => item.id !== id);
    setItemsList(updatedItemsList);
  };

  return (
    <>
      <div className="page-titles">
        <ol className="breadcrumb">
          <div className="menu-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.8381 12.7317C16.4566 12.7317 16.9757 13.2422 16.8811 13.853C16.3263 17.4463 13.2502 20.1143 9.54009 20.1143C5.43536 20.1143 2.10834 16.7873 2.10834 12.6835C2.10834 9.30245 4.67693 6.15297 7.56878 5.44087C8.19018 5.28745 8.82702 5.72455 8.82702 6.36429C8.82702 10.6987 8.97272 11.8199 9.79579 12.4297C10.6189 13.0396 11.5867 12.7317 15.8381 12.7317Z"
                stroke="#888888"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.8848 9.1223C19.934 6.33756 16.5134 1.84879 12.345 1.92599C12.0208 1.93178 11.7612 2.20195 11.7468 2.5252C11.6416 4.81493 11.7834 7.78204 11.8626 9.12713C11.8867 9.5459 12.2157 9.87493 12.6335 9.89906C14.0162 9.97818 17.0914 10.0862 19.3483 9.74467C19.6552 9.69835 19.88 9.43204 19.8848 9.1223Z"
                stroke="#888888"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <li>
            <h5 className="bc-title">Purchase Order # 1001</h5>
          </li>
        </ol>
      </div>

      <div className="add-item">
        <div className="card">
          <div className="card-body">
            <div className="row mb-2 mx-1">
              <div className="col-xl-3">
                <label className="form-label">Customer</label>
                <input
                  type="text"
                  name="CustomerId"
                  value={inputValue} // Bind the input value state to the value of the input
                  onChange={handleAutocompleteChange}
                  placeholder="Customers"
                  className="form-control form-control-sm"
                />
                {showCustomersList && customersList && (
                  <ul
                    style={{ top: "83px" }}
                    className="search-results-container"
                  >
                    {customersList.map((customer) => (
                      <li
                        style={{ cursor: "pointer" }}
                        key={customer.UserId}
                        onClick={() => {
                          selectCustomer(customer);
                        }} // Use the selectCustomer function
                      >
                        {customer.CompanyName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="col-xl-3">
                <label className="form-label">Service location</label>
                <Autocomplete
                  id="inputState19"
                  size="small"
                  options={sLList}
                  getOptionLabel={(option) => option.Name || ""}
                  value={
                    sLList.find(
                      (customer) =>
                        customer.ServiceLocationId ===
                        formData.ServiceLocationId
                    ) || null
                  }
                  onChange={handleSLAutocompleteChange}
                  isOptionEqualToValue={(option, value) =>
                    option.ServiceLocationId === value.ServiceLocationId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=""
                      placeholder="Service Locations"
                      className="bg-white"
                    />
                  )}
                  aria-label="Default select example"
                />
              </div>
              <div className="col-xl-3">
                <label className="form-label">Contact</label>

                <Autocomplete
                  id="inputState299"
                  size="small"
                  options={contactList}
                  getOptionLabel={(option) => option.FirstName || ""}
                  value={
                    contactList.find(
                      (contact) => contact.ContactId === formData.ContactId
                    ) || null
                  }
                  onChange={handleContactAutocompleteChange}
                  isOptionEqualToValue={(option, value) =>
                    option.ContactId === value.ContactId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=""
                      placeholder="Contacts"
                      className="bg-white"
                    />
                  )}
                  aria-label="Contact select"
                />
              </div>
            </div>
            <div className="row">
              <div className="basic-form ">
                <form onSubmit={(e) => {e.preventDefault()}}>
                  <div className="row">
                    <div className="mb-3 col-md-3">
                      <div className="col-md-12">
                        <label className="form-label">Vendor</label>
                        <select
                          id="inputState"
                          name="Vendor"
                          className="default-select form-control wide"
                          onChange={handleChange}
                        >
                          <option defaultValue>Crest DeVille</option>
                          <option value={1}>Option 1</option>
                          <option value={2}>Option 2</option>
                          <option value={3}>Option 3</option>
                        </select>
                      </div>
                      <div className="col-md-12">
                        <div className="c-details">
                          <ul>
                            <li>
                              <span>Vendor Address</span>
                              <p>1225 E.Wakeham</p>
                              <p>Santa Ana, CA 92705</p>
                              <p>USA</p>
                            </li>
                            <li>
                              <span>Sipping </span>
                              <p>1225 E.Wakeham</p>
                              <p>Santa Ana, CA 92705</p>
                              <p>USA</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Purchase Order</label>
                          <div className="input-group mb-2">
                            <div className="input-group-text">#</div>{" "}
                            <input
                              type="text"
                              name="PurchaseOrderNo"
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Leave blank to auto complete"
                            />
                          </div>
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Tags</label>
                          <select
                          id="inputState"
                          name="Tags"
                          className="default-select form-control wide"
                          onChange={handleChange}
                        >
                          <option defaultValue>Select tags</option>
                          <option value={1}>Needs PO</option>
                          <option value={2}>Pending Approval</option>                          
                        </select>
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Date</label>
                          <div className="input-group mb-2">
                            <div className="input-group-text">
                              <i className="fa fa-calendar "></i>
                            </div>
                            <input type="date" className="form-control" name="Date"  onChange={handleChange} />
                          </div>
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Due</label>
                          <div className="input-group mb-2">
                            <div className="input-group-text">
                              <i className="fa fa-calendar "></i>
                            </div>
                            <input type="date" className="form-control" name="DueDate"  onChange={handleChange} />
                          </div>
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Regional Manager</label>
                          <select
                            id="inputState"
                            name="RegionalManager"
                            className="default-select form-control wide"
                          >
                            <option defaultValue>Select Regional Manager</option>
                            <option value={1}>RM 1</option>
                            <option value={2}>RM 2</option>
                            <option value={3}>RM 3</option>
                          </select>
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Terms</label>
                          <input type="text" className="form-control" name="Terms"  onChange={handleChange} />
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Requested by</label>
                          <input type="text" className="form-control" name="Requested by"  onChange={handleChange} />
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Status</label>
                          <select className="default-select  form-control wide" name="Status"  onChange={handleChange}>
                            <option value={null}>select</option>
                            <option value="Open">Open</option>                            
                            <option value="Closed">Closed</option>                            
                          </select>
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Invoice Number</label>
                          <div className="input-group mb-2">
                            <div className="input-group-text">#</div>
                            <input type="text" className="form-control" name="InvoiceNo"  onChange={handleChange} />
                          </div>
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Ship to</label>
                          <div className="input-group mb-2">
                            <div className="input-group-text">
                              <i className="fa fa-map-pin "></i>
                            </div>
                            <input type="text" className="form-control" name="ShipTo"  onChange={handleChange}/>
                          </div>
                        </div>
                        <div className="mb-3 col-md-4">
                          <label className="form-label">Bill Number</label>
                          <div className="input-group mb-2">
                            <div className="input-group-text">#</div>
                            <input type="text" className="form-control" name="BillNo"  onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-body p-0">
                <div className="estDataBox">
                  <div className="itemtitleBar">
                    <h4>Items</h4>
                  </div>

                  <div className="table-responsive active-projects style-1 mt-2">
                    <table id="empoloyees-tblwrapper" className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Rate</th>
                          <th>Qty / Duration</th>
                          <th>Tax</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          itemsList && itemsList.length > 0 ? (
                            itemsList.map((item, index) => (
                              <tr key={item.id || index}>
                                {" "}
                                {/* Make sure item has a unique 'id' or use index as a fallback */}
                                <td>{item.Name}</td>
                                <td>{item.Description}</td>
                                <td>{item.Rate}</td>
                                <td>{item.Qty}</td>
                                <td></td>
                                <td>{item.Rate * item.Qty}</td>
                                <td>
                                  <div className="badgeBox">
                                    <span
                                      className="actionBadge badge-danger light border-0 badgebox-size"
                                      onClick={() => {
                                        deleteItem(item.id);
                                      }}
                                    >
                                      <span className="material-symbols-outlined badgebox-size">
                                        delete
                                      </span>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8">No items available</td>
                            </tr>
                          ) /* Add a null check or alternative content if formData.tblEstimateItems is empty */
                        }

                        <tr>
                          <td>
                            <>
                              <input
                                type="text"
                                placeholder="Search for items..."
                                className="form-control form-control-sm"
                                name="Name"
                                value={searchText}
                                onChange={handleItemChange}
                                ref={inputRef}
                              />
                              {searchResults.length > 0 && (
                                <ul style={{top : "13.1"}} className="items-search-results-container">
                                  {searchResults.map((item) => (
                                    <li
                                      style={{ cursor: "pointer" }}
                                      key={item.ItemId}
                                      onClick={() => handleItemClick(item)}
                                    >
                                      {showItem && item.ItemName}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </>
                          </td>
                          <td>
                            <textarea
                              name="Description"
                              className="form-txtarea form-control form-control-sm"
                              value={selectedItem?.SaleDescription || " "}
                              rows="1"
                              disabled
                            ></textarea>
                          </td>

                          <td>
                            <div className="col-sm-9">
                              <input
                                name="Rate"
                                value={
                                  selectedItem?.SalePrice ||
                                  itemInput.Rate ||
                                  " "
                                }
                                className="form-control form-control-sm"
                                placeholder="Rate"
                                disabled
                              />
                            </div>
                          </td>

                          <td>
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
                          </td>
                          <td>
                            <input
                              type="number"
                              name="Tax"
                              className="form-control form-control-sm"
                              placeholder="Tax"
                              disabled
                            />
                          </td>
                          <td>
                            <h5 style={{ margin: "0" }}>
                              {itemInput.Rate * itemInput.Qty}
                            </h5>
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                // Adding the new item to the itemsList
                                setItemsList((prevItems) => [
                                  ...prevItems,
                                  { ...itemInput, id: Date.now() }, // Ensure each item has a unique 'id'
                                ]);
                                // Reset the input fields
                                setSearchText("");
                                setSelectedItem(null);
                                setItemInput({
                                  Name: "",
                                  Qty: 1,
                                  Description: "",
                                  Rate: null,
                                });
                              }}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body p-0">
                <div className="estDataBox">
                  <div className="itemtitleBar">
                    <h4>Add lines</h4>
                  </div>
                  <button className="btn btn-primary btn-sm m-4">
                    + Add Items
                  </button>
                  <div className="table-responsive active-projects style-1">
                    <table id="empoloyees-tblwrapper" className="table">
                      <thead>
                        <tr>
                          <th>Qty / Duration</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Rate</th>
                          <th>Amount</th>
                          <th>Approved</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <span>1001</span>
                          </td>
                          <td>
                            <div className="products">
                              <div>
                                <h6>Liam Antony</h6>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>Computer Science</span>
                          </td>
                          <td>
                            <span className="text-primary">20</span>
                          </td>
                          <td>
                            <span>20</span>
                          </td>

                          <td>
                            <span className="badge badge-success light border-0">
                              Active
                            </span>
                          </td>
                          <td>
                            <a
                              href="#"
                              className="btn btn-danger shadow btn-xs sharp"
                            >
                              <i className="fa fa-trash"></i>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body row">
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-xl-12 col-lg-12">
                      <div className="basic-form">
                        
                          <h4 className="card-title">Memo Internal</h4>
                          <div className="mb-3">
                            <textarea
                              className="form-txtarea form-control"
                              rows="2"
                              id="comment"
                              name="MemoInternal"  onChange={handleChange}
                            ></textarea>
                          </div>
                        
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12">
                      <div className="basic-form">                   
                          <h4 className="card-title">Message</h4>
                          <div className="mb-3">
                            <textarea
                              className="form-txtarea form-control"
                              rows="2"
                              id="comment"
                              name="Message"  onChange={handleChange}
                            ></textarea>
                          </div>                        
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12">
                      <div className="basic-form">
                        <h4 className="card-title">Attachments</h4>
                        <div className="dz-default dlab-message upload-img mb-3">
                          <form action="#" className="dropzone">
                            <svg
                              width="41"
                              height="40"
                              viewBox="0 0 41 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M27.1666 26.6667L20.4999 20L13.8333 26.6667"
                                stroke="#DADADA"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                              <path
                                d="M20.5 20V35"
                                stroke="#DADADA"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                              <path
                                d="M34.4833 30.6501C36.1088 29.7638 37.393 28.3615 38.1331 26.6644C38.8731 24.9673 39.027 23.0721 38.5703 21.2779C38.1136 19.4836 37.0724 17.8926 35.6111 16.7558C34.1497 15.619 32.3514 15.0013 30.4999 15.0001H28.3999C27.8955 13.0488 26.9552 11.2373 25.6498 9.70171C24.3445 8.16614 22.708 6.94647 20.8634 6.1344C19.0189 5.32233 17.0142 4.93899 15.0001 5.01319C12.9861 5.0874 11.015 5.61722 9.23523 6.56283C7.45541 7.50844 5.91312 8.84523 4.7243 10.4727C3.53549 12.1002 2.73108 13.9759 2.37157 15.959C2.01205 17.9421 2.10678 19.9809 2.64862 21.9222C3.19047 23.8634 4.16534 25.6565 5.49994 27.1667"
                                stroke="#DADADA"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                              <path
                                d="M27.1666 26.6667L20.4999 20L13.8333 26.6667"
                                stroke="#DADADA"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                            <div className="fallback">
                              <input name="file" type="file" multiple="" />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <table className="table table-clear">
                    <tbody>
                      <tr>
                        <td className="left">
                          <strong>Subtotal</strong>
                        </td>
                        <td className="right">$8.497,00</td>
                      </tr>
                      <tr>
                        <td className="left">
                          <strong>Discount (20%)</strong>
                        </td>
                        <td className="right">$1,699,40</td>
                      </tr>
                      <tr>
                        <td className="left">
                          <strong>VAT (10%)</strong>
                        </td>
                        <td className="right">$679,76</td>
                      </tr>
                      <tr>
                        <td className="left">
                          <strong>Total</strong>
                        </td>
                        <td className="right">
                          <strong>$7.477,36</strong>
                          <br />
                          <strong>0.15050000 BTC</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mb-2 row text-end">
              <div>
                <a
                  href="#;"
                  className="btn btn-primary light me-1 px-3"
                  data-bs-toggle="modal"
                >
                  <i className="fa fa-print m-0"></i>{" "}
                </a>
                <a
                  href="#;"
                  className="btn btn-primary light me-1 px-3"
                  data-bs-toggle="modal"
                >
                  <i className="fa fa-envelope m-0"></i>{" "}
                </a>
                <a href="#">
                  <button type="button" className="btn btn-primary me-1">
                    Save
                  </button>
                </a>

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
        </div>
      </div>
    </>
  );
};
