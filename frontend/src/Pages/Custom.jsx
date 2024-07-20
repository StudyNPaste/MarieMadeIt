import React from 'react'

const Custom = () => {
  return (
    <div>
      <h1>Custom Order</h1>
      <form>
        <div>
          <label htmlFor="">Full Name</label>
          <input type="text" name='name' placeholder='Enter Your Name'/>
        </div>
        <div>
          <label htmlFor="">Email Address</label>
          <input type="email" name='email' placeholder='Enter Your Email'/>
        </div>
        <div>
          <label htmlFor="">Choose Category of Item</label>
          <select  name="category" value='clothes'>
              <option value="plushies">Plushies</option>
              <option value="accessories">Accessories</option>
              <option value="clothes">Clothes</option>
          </select>
        </div>
      </form>
    </div>
  )
}

export default Custom
