# Hotel Meghauli Safari Website

A beautiful, SEO-optimized static website for Hotel Meghauli Safari, located by the Rapti River in Meghauli, Chitwan, Nepal. This website features a complete booking system integrated with Google Sheets.

## 🌟 Features

- **Beautiful Design**: Modern, responsive design with Tailwind CSS
- **SEO Optimized**: Complete meta tags, Open Graph, schema.org markup
- **Booking System**: Integrated with Google Sheets for easy management
- **Email Notifications**: Automatic confirmation emails via Google Apps Script
- **Performance**: Lazy loading, optimized images, fast loading times
- **Accessibility**: WCAG AA compliant, keyboard navigation, ARIA labels
- **Bilingual Support**: English and Nepali content ready
- **Mobile-First**: Fully responsive across all devices

## 📁 Project Structure

```
meghaulisafari.github.io/
├── index.html                  # Main website file
├── js/
│   └── main.js                # JavaScript for interactivity and booking
├── google-apps-script.js      # Google Apps Script for form handling
├── README.md                  # This file
└── SETUP.md                   # Detailed setup instructions
```

## 🚀 Quick Start

### 1. GitHub Pages Deployment

1. **Initialize Git Repository**
   ```bash
   cd meghaulisafari.github.io
   git init
   git add .
   git commit -m "Initial commit: Hotel Meghauli Safari website"
   ```

2. **Create GitHub Repository**
   - Go to [GitHub](https://github.com)
   - Create a new repository named `meghaulisafari.github.io`
   - Don't initialize with README (we already have one)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/meghaulisafari.github.io.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to "Pages" section
   - Source: Deploy from a branch
   - Branch: main, folder: / (root)
   - Click Save

5. **Your site will be live at**: `https://YOUR_USERNAME.github.io/meghaulisafari.github.io/`

### 2. Google Sheets Setup (For Booking System)

#### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Hotel Meghauli Safari - Bookings"
4. The script will automatically create columns on first submission

#### Step 2: Set Up Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any default code
3. Copy the entire content from `google-apps-script.js`
4. Paste it into the Apps Script editor
5. Update the `ADMIN_EMAIL` constant if needed:
   ```javascript
   const ADMIN_EMAIL = 'meghaulisafari@gmail.com';
   ```

#### Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon ⚙️ and select **Web app**
3. Fill in the details:
   - **Description**: "Booking Form Handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. Grant permissions when prompted:
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" > "Go to [Project Name] (unsafe)"
   - Click "Allow"
6. **Copy the Web App URL** (it looks like: `https://script.google.com/macros/s/XXXX/exec`)

#### Step 4: Update Website Configuration

1. Open `js/main.js`
2. Find this line:
   ```javascript
   const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
3. Replace with your copied Web App URL
4. Save the file

#### Step 5: Commit and Push Changes

```bash
git add js/main.js
git commit -m "Add Google Sheets integration URL"
git push
```

### 3. Custom Domain Setup (Optional)

#### For meghaulisafari.com domain:

1. **In GitHub Repository Settings**:
   - Go to Settings > Pages
   - Under "Custom domain", enter: `meghaulisafari.com`
   - Check "Enforce HTTPS"
   - Click Save

2. **In Your Domain Registrar** (where you bought the domain):

   Add these DNS records:

   **For apex domain (meghaulisafari.com):**
   ```
   Type: A
   Name: @
   Value: 185.199.108.153

   Type: A
   Name: @
   Value: 185.199.109.153

   Type: A
   Name: @
   Value: 185.199.110.153

   Type: A
   Name: @
   Value: 185.199.111.153
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```

3. **Wait for DNS Propagation** (can take 24-48 hours)
4. Your site will be live at `https://meghaulisafari.com`

## 📝 Content Management

### Updating Content

All content is in `index.html`. To update:

1. **Hotel Information**: Edit the About section
2. **Room Prices**: Update in the Rooms section
3. **Contact Details**: Already configured (+977-9855014882)
4. **Images**: Replace Unsplash URLs with your own images

### Adding Real Images

Replace placeholder images with your actual hotel photos:

1. Create an `assets/images/` folder
2. Add your images there
3. Update image paths in `index.html`:
   ```html
   <!-- Old -->
   <img src="https://images.unsplash.com/photo-XXXX">

   <!-- New -->
   <img src="assets/images/your-photo.jpg">
   ```

### Recommended Images Needed

- `hero-background.jpg` (1920x1080) - Main hero section
- `hotel-exterior.jpg` (1200x800) - Hotel building
- `room-standard.jpg` (800x600) - Standard room
- `room-deluxe.jpg` (800x600) - Deluxe room
- `room-suite.jpg` (800x600) - Suite
- `restaurant.jpg` (800x600) - Dining area
- `rapti-river.jpg` (800x600) - River view
- `wildlife-*.jpg` (800x600) - Rhinos, birds, etc.
- `og-image.jpg` (1200x630) - Social media preview

## 🔧 Configuration

### Update Contact Information

Search and replace these placeholders throughout the files:

- Phone number: `+977-9855014882` (Already set)
- Email: `meghaulisafari@gmail.com` (Already set)
- `YOUR_USERNAME` → Your GitHub username (Replace in deployment steps)

### Update Google Analytics (Optional)

Add your GA4 tracking code before `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 📧 Email Notifications

The booking system automatically sends:

1. **Guest Confirmation**: Sent to the guest's email with booking details
2. **Admin Notification**: Sent to meghaulisafari@gmail.com with full details

To test emails:

1. Open Google Apps Script editor
2. Uncomment the `testEmails()` function
3. Update the test email address
4. Run the function
5. Check both guest and admin emails

## 🎨 Customization

### Colors

The website uses these brand colors (defined in Tailwind config):

- **Primary**: `#2C5F2D` (Forest Green)
- **Secondary**: `#97BC62` (Light Green)
- **Accent**: `#D4A574` (Gold/Tan)
- **Dark**: `#1A1A1A` (Almost Black)
- **Light**: `#F8F7F4` (Off White)

To change colors, edit the `tailwind.config` in `index.html`.

### Typography

Currently using:
- **Body**: Inter (sans-serif)
- **Headings**: Georgia (serif)

To change, update Google Fonts link and tailwind.config.

## 📊 Managing Bookings

### Google Sheet Columns

The booking sheet contains:
- Timestamp
- Booking ID
- Status (New/Confirmed/Declined)
- Guest Name
- Email
- Phone
- Room Type
- Number of Guests
- Check-in Date
- Check-out Date
- Number of Nights
- Special Requests
- Arrival Time
- Airport Pickup (Yes/No)
- Source Page
- User Agent

### Workflow

1. **Guest submits booking** → Data saved to sheet + emails sent
2. **Review the booking** → Check availability
3. **Update status** → Change from "New" to "Confirmed" or "Declined"
4. **Contact guest** → Reply with confirmation and payment details
5. **Track bookings** → Use sheet filters and charts

## 🔒 Security Features

- **Honeypot**: Spam protection on booking form
- **No-CORS**: Secure form submission
- **Input Validation**: Required fields and format checking
- **Rate Limiting**: Google Apps Script has built-in limits

## 📱 Testing

### Test Checklist

- [ ] All links work correctly
- [ ] Mobile responsiveness on different screen sizes
- [ ] Booking form submits successfully
- [ ] Emails are received (guest + admin)
- [ ] Data appears correctly in Google Sheet
- [ ] Images load properly
- [ ] Page loads quickly (< 3 seconds)
- [ ] SEO tags are correct (use [OpenGraph.xyz](https://www.opengraph.xyz/))
- [ ] Accessibility check (use [WAVE](https://wave.webaim.org/))

### Browser Testing

Test on:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Android)

## 📈 SEO Optimization

### Included Features

✅ Meta title and description
✅ Open Graph tags (Facebook, LinkedIn)
✅ Twitter Card tags
✅ Schema.org JSON-LD markup
✅ Semantic HTML
✅ Alt text on images
✅ Fast loading times
✅ Mobile-friendly
✅ HTTPS (via GitHub Pages)

### Additional SEO Tips

1. **Submit sitemap** to Google Search Console
2. **Register on Google My Business**
3. **Get listed** on TripAdvisor, Booking.com
4. **Build backlinks** from tourism websites
5. **Create content** about Chitwan National Park

## 🆘 Troubleshooting

### Booking Form Not Working

1. **Check browser console** for errors (F12)
2. **Verify Google Apps Script URL** in `main.js`
3. **Check Apps Script deployment** permissions
4. **Test with Apps Script test function**

### Emails Not Sending

1. **Check Gmail quota** (100 emails/day for free Gmail)
2. **Verify email addresses** in script
3. **Check spam folder**
4. **Review Apps Script execution logs**

### GitHub Pages Not Updating

1. **Wait 2-5 minutes** after pushing changes
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Check repository Settings > Pages** for errors

## 📞 Support

For technical issues with this website:
- Check GitHub Issues
- Review documentation
- Contact the developer

For hotel bookings:
- Email: meghaulisafari@gmail.com
- Phone: +977-9855014882
- WhatsApp: +977-9855014882

## 📜 License

This website is created for Hotel Meghauli Safari. All rights reserved.

## 🙏 Credits

- **Design & Development**: Created with Claude Code
- **Images**: Unsplash (replace with actual hotel photos)
- **Icons**: Unicode emojis
- **Fonts**: Google Fonts (Inter)
- **Framework**: Tailwind CSS
- **Hosting**: GitHub Pages

---

**Last Updated**: October 2025
**Version**: 1.0.0

For detailed setup instructions, see [SETUP.md](SETUP.md)