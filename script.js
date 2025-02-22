// Refer Booking Appointment app for understanding
// I added dynamic category and price feature - a extra feature in this project which is not available in the booking appointment app
// Iss feature me product ki jo bhi category hogi product us category ke title ke niche show hoga 
// and category aur price apne aap update honge product ke add, delete or update hone pe

let url =
  "https://crudcrud.com/api/74a2bcd5c340485db9a3451d3fe9209b/productsData";
let responseData = [];

let categoryObj = { // this will keep track of category divs
  "Clothing and Apparel": 0,
  "Electronics": 0,
  "Home and Kitchen": 0,
  "Beauty and Personal Care": 0,
  "Books and Literature": 0,
  "Health and Wellness": 0,
  "Sports and Outdoors": 0,
  "Toys and Games": 0,
  "Automotive and Tools": 0,
  "Jewelry and Accessories": 0,
  "Furniture and Home Decor": 0,
  "Food and Groceries": 0,
  "Pet Supplies": 0,
  "Baby and Kids": 0,
  "Music and Movies": 0,
  "Office Supplies": 0,
  "Fitness and Exercise": 0,
  "Arts and Crafts": 0,
  "Travel and Luggage": 0,
  "Shoes and Footwear": 0,
};

let totalPrice = 0;

const nameInput = document.querySelector("#name");
const priceInput = document.querySelector("#price");
const categoryInput = document.querySelector("#category");

const productForm = document.querySelector("#productForm");
productForm.addEventListener("submit", onSubmit);

window.addEventListener("DOMContentLoaded", refresh);

async function refresh() {

  try {
    let response = await axios.get(url);
    for (let i = 0; i < response.data.length; i++) {
      // console.log(response.data[i]);
      updateResponseData("getORpost", response.data[i]);
      updateCategoryAndTotalPrice("getORpost", response.data[i]); // update category and total price
      displayProductOnScreen(response.data[i]);
    }
  }
  catch(error) {
    console.log(error);
  }
};

function onSubmit(event) {
  event.preventDefault();

  addDetailsCard(event);

  nameInput.value = "";
  priceInput.value = "";
  categoryInput.value = "";
}

async function addDetailsCard(event) {
  console.log(event);
  let productDetailsObj = {
    productName: `${nameInput.value}`,
    productPrice: `${priceInput.value}`,
    productCategory: `${categoryInput.value}`,
    uniqueKey: `${new Date().getTime()}`,
  };

  try {
    let response = await axios.post(url, productDetailsObj);
    updateResponseData("getORpost", response.data);
    updateCategoryAndTotalPrice("getORpost", productDetailsObj); // update category and total price
    displayProductOnScreen(response.data);
  }
  catch (error) {
    console.log(error);
  }

}

async function deleteDetailsCard(event) {
  let targetObj = getTargetObj(event.target.parentNode.parentNode);

  try {
    let response = await axios.delete(`${url}/${targetObj._id}`);
    updateResponseData("delete", targetObj);
    updateCategoryAndTotalPrice("delete", targetObj); // updated category and total price
    event.target.parentNode.parentNode.remove();
  }
  catch (error) {
    console.log(error);
  }
  
}

function editDetailsCard(event) {
  let targetObj = getTargetObj(event.target.parentNode.parentNode);

  document.getElementById(
    `${targetObj.uniqueKey}`
  ).innerHTML = ` <form action="#" class="w-75 mx-auto" id="editProductForm">
    <!-- Product Name -->
    <div class="col mb-3">
        <label for="editName" class="col-form-label">Product Name</label>
        <input type="text" class="form-control" name="editName" id="editName" value=${targetObj.productName}>
    </div>
    
    <!-- Price -->
    <div class="col mb-3">
        <label for="editPrice" class="col-form-label">Price</label>
        <input type="number" class="form-control" name="editPrice" id="editPrice" value=${targetObj.productPrice} >
    </div>

    <!-- Choose Category -->
    <div class="col mb-3">
        <label for="editCategory" class="col-form-label">Choose Category</label>
        <select name="editCategory" id="editCategory" class="form-select form-control">
            <option value="${targetObj.productCategory}" selected>${targetObj.productCategory}</option>
            <option value="Clothing and Apparel">Clothing and Apparel</option>
            <option value="Electronics">Electronics</option>
            <option value="Home and Kitchen">Home and Kitchen</option>
            <option value="Beauty and Personal Care">Beauty and Personal Care</option>
            <option value="Books and Literature">Books and Literature</option>
            <option value="Health and Wellness">Health and Wellness</option>
            <option value="Sports and Outdoors">Sports and Outdoors</option>
            <option value="Toys and Games">Toys and Games</option>
            <option value="Automotive and Tools">Automotive and Tools</option>
            <option value="Jewelry and Accessories">Jewelry and Accessories</option>
            <option value="Furniture and Home Decor">Furniture and Home Decor</option>
            <option value="Food and Groceries">Food and Groceries</option>
            <option value="Pet Supplies">Pet Supplies</option>
            <option value="Baby and Kids">Baby and Kids</option>
            <option value="Music and Movies">Music and Movies</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Fitness and Exercise">Fitness and Exercise</option>
            <option value="Arts and Crafts">Arts and Crafts</option>
            <option value="Travel and Luggage">Travel and Luggage</option>
            <option value="Shoes and Footwear">Shoes and Footwear</option>
        </select>
    </div>

    <!-- Submit Button -->
    <div class="col mt-4 mb-2">
        <div class="col-12 d-flex justify-content-center">
            <input type="submit" class="form-control button d-flex justify-content-center bg-success" value="Done">
        </div>
    </div>
    </form>`;

  const editProductForm = document.querySelector("#editProductForm");
  editProductForm.addEventListener("submit", addEditedCard);
}

async function addEditedCard(event) {

  event.preventDefault();
  let targetObj = getTargetObj(event.target.parentNode);
  console.log(targetObj);

  let editedProductObj = {
    productName: event.target.editName.value,
    productPrice: event.target.editPrice.value,
    productCategory: event.target.editCategory.value,
    uniqueKey: targetObj.uniqueKey,
  };

  // Jb bhi mai tragetObj ko sidhe hi pass kr rha tha to usme wo keys ki values h wo change ho jaa rhi thi aur new values editedProductObj ki hoti thi
  // to maybe yhape tagetObj aur editedProductObj same location ko point kr rhe h isiliye jb mai editedProductObj me values update kr rha hu to targetObj me bhi values update ho rhi h
  // Isiliye maine targetObj ko sidha na bhejke uski copy create krli jisse ki hmare pass old values aa gyi aur fir us object ko pass kr diya
  // ab agr targetObj change bhi ho jaata h to bhi hmare pass old values rhegi
  let argObj = [Object.assign({}, targetObj), editedProductObj];
  console.log(argObj);

  console.log(targetObj);

  try {
    let response = await axios.put(`${url}/${targetObj._id}`, editedProductObj);
    updateResponseData("put", editedProductObj);
    updateCategoryAndTotalPrice("put", argObj); // updated category and total price

      document.getElementById(`${targetObj.uniqueKey}`).innerHTML =
      `<div>
          <h5> ${editedProductObj.productName} </h5>
          <h6> Price : ${editedProductObj.productPrice} </h6>
          <h6> Category : ${editedProductObj.productCategory} </h6>
      </div>
      <div class ="d-flex justify-content-end">
          <button class="btn btn-danger m-2 p-2" onclick="deleteDetailsCard(event)">X</button>
          <button class="btn btn-primary m-2 p-2" onclick="editDetailsCard(event)">Edit</button>
      </div>`;
  }
  catch (error) {
    console.log(error);
  }
  
}

function displayProductOnScreen(productDetailsObj) {
  document.querySelector(
    `[title="${productDetailsObj.productCategory}"]`
  ).innerHTML += `<div class="card" id=${productDetailsObj.uniqueKey}>
            <div>
                <h5> ${productDetailsObj.productName} </h5>
                <h6> Price : ${productDetailsObj.productPrice} </h6>
                <h6> Category : ${productDetailsObj.productCategory} </h6>
            </div>
            <div class ="d-flex justify-content-end">
                <button class="btn btn-danger m-2 p-2" onclick="deleteDetailsCard(event)">X</button>
                <button class="btn btn-primary m-2 p-2" onclick="editDetailsCard(event)">Edit</button>
            </div>
        </div>`;
}

function updateResponseData(requestType, paramObj) {
  if (requestType == "getORpost") {
    responseData.push(paramObj);
  } else if (requestType == "delete") {
    responseData = responseData.filter((ele) => ele._id != paramObj._id);
  } else if (requestType == "put") {
    for (let i = 0; i < responseData.length; i++) {
      if (responseData[i].uniqueKey == paramObj.uniqueKey) {
        responseData[i].productName = paramObj.productName;
        responseData[i].productPrice = paramObj.productPrice;
        responseData[i].productCategory = paramObj.productCategory;
        break;
      }
    }
  }
}

function getTargetObj(element) {
  for (let i = 0; i < responseData.length; i++) {
    if (responseData[i].uniqueKey == element.id) return responseData[i];
  }
}

function updateCategoryAndTotalPrice(requestType, paramObj) {

  if (requestType == "getORpost") {
    // category update
    categoryObj[paramObj.productCategory]++;
    let targetCategory = document.querySelector(`[title="${paramObj.productCategory}"]`);
    targetCategory.classList.contains("d-none") ? targetCategory.classList.remove("d-none") : "";
    // price update
    totalPrice += Number(paramObj.productPrice);
  }
  else if (requestType == "delete") {
    // category update
    categoryObj[paramObj.productCategory]--;
    categoryObj[paramObj.productCategory] == 0 ? document.querySelector(`[title="${paramObj.productCategory}"]`).classList.add("d-none") : "";
    // price update
    totalPrice -= Number(paramObj.productPrice);
  }
  else if (requestType == "put") { // category changed then update category

    if (paramObj[0].productCategory != paramObj[1].productCategory) {
      categoryObj[paramObj[0].productCategory]--;
      categoryObj[paramObj[1].productCategory]++;

      categoryObj[paramObj[0].productCategory] == 0 ? document.querySelector(`[title="${paramObj[0].productCategory}"]`).classList.add("d-none") : "";

      let targetCategory = document.querySelector(`[title="${paramObj[1].productCategory}"]`);
      targetCategory.classList.contains("d-none") ? targetCategory.classList.remove("d-none") : "";
    
      let oldCategoryDiv = document.querySelector(`[title="${paramObj[0].productCategory}"]`);
      let newCategoryDiv = document.querySelector(`[title="${paramObj[1].productCategory}"]`);
      let cardDiv = document.getElementById(`${paramObj[0].uniqueKey}`);

      oldCategoryDiv.removeChild(cardDiv);
      newCategoryDiv.appendChild(cardDiv);
    }

    if (paramObj[0].productPrice != paramObj[1].productPrice) {  // if price changed then update price
      totalPrice -= Number(paramObj[0].productPrice);
      totalPrice += Number(paramObj[1].productPrice);
    }
  }
  // in each case we will update total price
  // kyunki sirf put -- if category change wale case me hume price change krne ki jrurat nhi h baaki sbme h(kyunki usme price change nhi hua h)
  // to agr hum iss line ko bahar likhte h to sirf us case me extra kaam hoga jisse itna frk nhi pdta isiliye humne sb case me price update kr diya
  // agr hum isko bahar na likhte to fir hume isko getORpost, delete and put -- if price change 3 jgah likhna pdta
  document.querySelector(".total").textContent = `Total Price : ${totalPrice} Rs.`;
}

/*
I had two options :
update category in one function and update total price in another function
OR
update both in one function

So, I am going with second option. Why?
Because both have similarity in syntax so i don't want to write same syntax twice
*/