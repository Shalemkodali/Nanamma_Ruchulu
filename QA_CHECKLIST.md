# QA Manual Testing Checklist: The Spice Rack

## Phase 1: Core Features (The "Must-Haves")

### 1. Guest User Flow (Browsing)
* [ ] **Load Homepage:** Open `http://localhost:3000`. [cite_start]Verify that a list of products loads from the database[cite: 16].
* [cite_start][ ] **Product Display:** Verify each product card shows an image, name, price, and rating [cite: 75-81].
* [ ] **View Details:** Click on a product (e.g., "Smoked Paprika"). [cite_start]Verify it navigates to `/product/:id` and shows the description and stock count[cite: 17, 78].
* [cite_start][ ] **Stock Logic:** Verify that if a product is "Out of Stock," the "Add to Cart" button is disabled[cite: 82].

### 2. Authentication Flow
* [ ] **Register Account:** Go to `/register`. create a new user (e.g., `Test User`). [cite_start]Verify you are redirected to the homepage and your name appears in the navbar[cite: 19].
* [cite_start][ ] **Database Check:** (Optional) Check MongoDB Compass to see if the new user was created in the `users` collection[cite: 86].
* [ ] **Log Out:** Click "Logout" in the navbar. [cite_start]Verify you are redirected to `/login` or homepage and the profile menu disappears[cite: 20].
* [ ] **Log In:** Go to `/login`. Enter the credentials of the user you just created. [cite_start]Verify successful login[cite: 20].
* [ ] **Invalid Login:** Try logging in with a wrong password. Verify an error message appears (e.g., "Invalid email or password").

### 3. Shopping Cart Flow
* [ ] **Add to Cart:** On a product page, choose quantity `2` and click "Add to Cart". [cite_start]Verify you are redirected to `/cart`[cite: 22].
* [cite_start][ ] **Cart Contents:** Verify the cart shows the correct item, price ($8.99), quantity (2), and the correct subtotal ($17.98)[cite: 23].
* [ ] **Adjust Quantity:** Change the quantity from `2` to `3`. [cite_start]Verify the subtotal updates instantly[cite: 24].
* [ ] **Remove Item:** Click the trash icon. [cite_start]Verify the item disappears from the list[cite: 24].
* [ ] **Persist Cart:** Refresh the page. Verify the items are still in the cart (if using local storage).

---

## Phase 2: Intermediate Features (The "Should-Haves")

### 4. Checkout & Payment Flow
* [ ] **Checkout Trigger:** Click "Proceed to Checkout" in the cart. Verify it redirects to `/login` if not logged in, or `/shipping` if logged in.
* [ ] **Shipping Address:** Enter a shipping address and click "Continue". [cite_start]Verify it saves to Redux/Local Storage[cite: 26].
* [ ] **Payment Method:** Select "Stripe/Credit Card" and continue.
* [ ] **Place Order:** Review the order summary (Items + Shipping + Tax). [cite_start]Click "Place Order"[cite: 161].
* [ ] **Stripe Test:** Enter Stripe test card details (Use a test card like `4242 4242 4242 4242`). [cite_start]Verify success message[cite: 27].
* [cite_start][ ] **Order Confirmation:** Verify redirection to `/order/:id` with a "Paid" status and timestamp[cite: 123].

### 5. User Profile
* [ ] **View Profile:** Go to "My Profile". [cite_start]Verify it shows the correct name and email[cite: 37].
* [ ] **Update Profile:** Change your name to "Updated Name" and password. Save. [cite_start]Log out and log back in with the new password[cite: 38].
* [ ] **Order History:** In the profile, verify the order you just placed appears in the list. [cite_start]Click it to see details[cite: 37].

### 6. Search & Reviews
* [ ] **Search:** Type "Salt" in the search bar. [cite_start]Verify the results list only shows products with "Salt" in the name[cite: 33].
* [ ] **Write Review:** Go to a product you haven't reviewed. Select 5 stars and write "Great spice!". Submit.
* [cite_start][ ] **Verify Review:** Verify the review appears immediately at the bottom of the page and the average rating updates[cite: 34].

---

## Phase 3: Admin Features (Protected)

### 7. Security Check
* [ ] **Protect Admin Routes:** Log in as a *normal* user. Try to manually visit `/admin/userlist` in the URL bar. [cite_start]Verify you are redirected to the homepage (Access Denied)[cite: 29].

### 8. Admin Management
* [ ] **Admin Login:** Log in with your Admin credentials. Verify the "Admin" menu appears in the navbar.
* [ ] **User List:** Go to "Users". [cite_start]Verify you see a list of all registered users[cite: 41].
* [ ] **Delete User:** Delete the "Test User" created earlier. Verify they are removed from the list.
* [ ] **Product List:** Go to "Products". Click "Create Product". Fill in sample data. [cite_start]Verify the new product appears on the homepage[cite: 30].
* [ ] **Edit Product:** Click "Edit" on a product. Change the price. Save. [cite_start]Verify the price updates on the storefront[cite: 30].
* [ ] **Order List:** Go to "Orders". [cite_start]Verify you see the order placed in Step 4[cite: 40].
* [ ] **Update Order Status:** Click "Details" on an order. Mark it as "Delivered". [cite_start]Verify the status updates[cite: 42].