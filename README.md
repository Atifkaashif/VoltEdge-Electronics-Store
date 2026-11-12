# VoltEdge --- Premium Electronics Store

A modern, responsive, multi-page electronics store front-end built with
**HTML, CSS, and JavaScript**. VoltEdge lets visitors browse
electronics, explore product categories, use a shopping cart, and access
account and admin demo interfaces.

> **Project type:** Front-end demonstration\
> **Storage:** Browser `localStorage`\
> **Backend:** Not included

## Features

-   Responsive multi-page website layout
-   Home page with featured store content
-   Shop page with product browsing, search, and filtering
-   Product categories page
-   Shopping cart and demo checkout flow
-   Wishlist functionality
-   Login and registration demo pages
-   Admin dashboard interface
-   About and contact pages
-   Theme preference saved in browser storage
-   Interactive alerts and charts using CDN libraries where included

## Pages

  File                Description
  ------------------- -----------------------------
  `index.html`        Store home page
  `shop.html`         Browse and search products
  `categories.html`   Explore product categories
  `about.html`        Store information
  `contact.html`      Contact page
  `login.html`        Demo login interface
  `register.html`     Demo registration interface
  `admin.html`        Admin dashboard interface

## Technologies Used

-   **HTML5** --- page structure
-   **CSS3** --- styling, responsive layouts, and animations
-   **JavaScript** --- interactions and front-end functionality
-   **localStorage** --- saves demo data in the browser
-   **Chart.js** --- charts in the admin interface (loaded from CDN)
-   **SweetAlert2** --- alert dialogs (loaded from CDN)
-   **Google Fonts** --- Plus Jakarta Sans typography

## Project Structure

``` text
VoltEdge-Store/
├── index.html
├── shop.html
├── categories.html
├── about.html
├── contact.html
├── login.html
├── register.html
├── admin.html
├── style.css
├── app.js
├── admin.js
└── README.md
```

## Getting Started

### 1. Download or clone the repository

``` bash
git clone https://github.com/YOUR_USERNAME/VoltEdge-Electronics-Store.git
```

### 2. Open the project

``` bash
cd VoltEdge-Electronics-Store
```

### 3. Run the website

**Option A --- VS Code Live Server**

1.  Open the project folder in Visual Studio Code.
2.  Install the **Live Server** extension if it is not already
    installed.
3.  Right-click `index.html`.
4.  Select **Open with Live Server**.

**Option B --- Open directly**

Double-click `index.html` to open it in your browser. Live Server is
recommended while developing.

## Demo Data and Storage

This project is currently a front-end demo. Product, cart,
account/session, and related demo data are handled in the browser using
`localStorage` where implemented.

-   Data is stored in the current browser on the current device.
-   Clearing browser site data may remove saved demo information.
-   The demo does not provide server-side authentication or a shared
    database.

## Important Security Notes

-   Do not use real passwords or sensitive personal information with the
    demo login or registration forms.
-   Any demo credentials included in the JavaScript source are public
    and must not be treated as secure.
-   The admin interface is a front-end demonstration, not a protected
    production admin system.
-   A production store needs a secure backend, database, server-side
    validation, password hashing, authorization, and a payment provider
    integration.

## Deployment

This project can be hosted as a static website using **GitHub Pages**:

1.  Push the project to a GitHub repository.
2.  Open the repository's **Settings → Pages**.
3.  Under **Build and deployment**, choose **Deploy from a branch**.
4.  Select the `main` branch and `/ (root)` folder.
5.  Save and wait for GitHub Pages to publish the site.

The published URL will look like:

``` text
https://YOUR_USERNAME.github.io/VoltEdge-Electronics-Store/
```

GitHub Pages supports the current HTML, CSS, and JavaScript front end.
It does not run PHP, Node.js server code, or MySQL databases.

## Future Improvements

-   Add a backend API and database for persistent products, users, and
    orders.
-   Implement secure server-side authentication and admin authorization.
-   Connect a real payment gateway.
-   Add order tracking, stock management, and email notifications.
-   Add automated tests and accessibility improvements.

## Author

**Atif Kashif**

## License

No license has been specified for this project. All rights remain with
the project author unless a license is added.
