# Salesfam Tracking Integration Guide & PRD

This document outlines the core capabilities of the Salesfam Tracking Engine, divided into what users and the system can do, along with clear integration instructions for client developers.

## Current Project Stage (As of Latest Update)
> [!NOTE]  
> **Stage: MVP Foundation / Early Development**  
> The repository currently has a robust foundation (Next.js 14, MongoDB, NextAuth) with working user authentication, basic CRM features (Company/Project models), and user settings. 
> 
> **Tracking Engine Status:** The tracking architecture detailed in this document is currently in the **planning and design phase** and has *not yet been implemented*. The next step in development is to build out this backend architecture (database models, API key generation, tracking endpoints) and subsequently integrate it into the frontend dashboard.

## 1. User Capabilities (What the Salesperson/Client Admin Can Do)

### For Salespeople
- **Custom Referral Codes:** Every salesperson can choose and set their own unique, human-readable referral code (e.g., `?ref=john-doe-2024`).
- **Dashboard Tracking:** Salespeople can log into Salesfam and view a real-time feed of the activities, leads, and sales generated specifically through their referral link.
- **Easy Sharing:** They simply copy their referral link and share it via email, LinkedIn, or directly with prospects.

### For Client Admins (Company Owners)
- **API Key Generation:** Admins can generate, view, and rotate a unique Stripe-like API key for their company directly from the Salesfam dashboard.
- **Team Oversight:** Admins have an aggregate view of all sales activities across their entire team, seeing which reps are driving the most traffic and conversions.
- **Domain Whitelisting:** Admins can specify which website domains are authorized to use their API key for enhanced security.

---

## 2. System Capabilities (What Salesfam Does Automatically)

- **Cross-Session Tracking:** When a customer clicks a referral link, the system (via the tracking script) automatically saves the referral code in the browser (Cookies/LocalStorage) for 30 days. Even if the customer leaves and returns later to purchase, the salesperson still gets credit.
- **Event Logging:** The system securely receives HTTP POST requests from the client's website, validating the API key and logging events (e.g., `purchase`, `form_submit`) to the Salesfam database.
- **Real-time Attribution:** The system instantly matches incoming events with the correct salesperson's profile using the stored referral code and updates the dashboard metrics.

---

## 3. Developer Integration Guide

Integrating Salesfam tracking is designed to be as simple as integrating Stripe. It works seamlessly across standard HTML sites, React, Next.js, and more.

### Step 1: Add your API Key to Environment Variables
In your project's `.env` file, add your unique company API key provided in the Salesfam dashboard:
```env
NEXT_PUBLIC_SALESFAM_API_KEY=sf_a1b2c3d4e5f6g7h8i9j0
```

### Step 2: Install the Tracking Snippet

#### Option A: Next.js / React (App Router Example)
Create a global tracker component or embed the script in your root layout.

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Initialize Salesfam */}
        <Script id="salesfam-init" strategy="beforeInteractive">
          {`
            window.Salesfam = window.Salesfam || {};
            window.Salesfam.init = function(key) { window.Salesfam._apiKey = key; };
            window.Salesfam.track = function(event, meta) {
               // The script handles the logic to grab the stored '?ref=' code
               const ref = localStorage.getItem('sf_ref');
               if(!ref) return;
               
               fetch('https://salesfam.com/api/tracking', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json', 'x-api-key': window.Salesfam._apiKey },
                 body: JSON.stringify({ ref, eventType: event, metadata: meta, sourceUrl: window.location.href })
               });
            };
            
            // Check URL for referral and store it
            const params = new URLSearchParams(window.location.search);
            if(params.get('ref')) {
               localStorage.setItem('sf_ref', params.get('ref'));
            }

            // Initialize with your API key
            window.Salesfam.init("${process.env.NEXT_PUBLIC_SALESFAM_API_KEY}");
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

#### Option B: Vanilla HTML / Webflow / Shopify
Simply paste this snippet right before the closing `</head>` tag on your website:

```html
<script src="https://salesfam.com/tracker.js" data-api-key="sf_a1b2c3d4e5f6g7h8i9j0" defer></script>
<script>
  window.addEventListener('load', function() {
    window.Salesfam.init('sf_a1b2c3d4e5f6g7h8i9j0');
  });
</script>
```

### Step 3: Track Events (The "Few Lines of Code")

Whenever a user completes a valuable action on your site, call the track function. The referral code is automatically attached behind the scenes.

### Supported Event Types
You can pass any of the following standard event types into the `track()` function:
- `page_view`: User viewed a page
- `click`: User clicked a specific element
- `form_submit`: User submitted a form (contact, lead gen, etc.)
- `purchase`: User made a payment/bought something
- `add_to_cart`: User added an item to their cart
- `begin_checkout`: User started the checkout process
- `meeting_booked`: User scheduled a call/meeting
- `sign_up`: User registered for an account
- `login`: User logged into their account
- `download`: User downloaded a resource (PDF, etc.)
- `video_play`: User watched a video
- `newsletter_signup`: User subscribed to an email list
- `custom`: Catch-all for custom events not listed above

**Example: Tracking a Purchase in React/Next.js**
```tsx
const handleCheckoutSuccess = async (orderData) => {
  // Your normal checkout logic here...

  // Tell Salesfam a purchase happened!
  if (window.Salesfam) {
    window.Salesfam.track('purchase', {
      orderId: orderData.id,
      amount: orderData.totalAmount,
      currency: "USD"
    });
  }
}
```

**Example: Tracking a Contact Form Submission**
```html
<form onsubmit="handleFormSubmit()">
  <!-- form fields -->
  <button type="submit">Contact Us</button>
</form>

<script>
function handleFormSubmit() {
  if (window.Salesfam) {
    window.Salesfam.track('form_submit', {
      formName: "Main Contact Form"
    });
  }
}
</script>
```
