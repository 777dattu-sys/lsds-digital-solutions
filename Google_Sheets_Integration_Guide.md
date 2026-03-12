# Google Sheets Lead Capture Integration Guide

Follow these steps to connect your landing page form to Google Sheets automatically:

## Step 1: Create a Google Sheet
1. Go to Google Sheets and create a new spreadsheet.
2. Name the sheet (e.g., "Meta Ads Leads").
3. Create the following headers in Row 1:
   - A1: `Date`
   - B1: `name`
   - C1: `phone`
   - D1: `city`
   - E1: `User Type`
   - F1: `WhatsApp Number`
   - G1: `Source`

## Step 2: Open Apps Script
1. In your Google Sheet, click on **Extensions** > **Apps Script**.
2. Delete any code in the script editor and paste the following code:

```javascript
const sheetName = 'Sheet1'; // Change this if your sheet tab has a different name
const scriptProp = PropertiesService.getScriptProperties();

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost (e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const newRow = headers.map(function(header) {
      if (header === 'Date') {
        return new Date().toLocaleString();
      } else {
        // Strip all spaces and make it completely lowercase to ignore misspellings/casing
        const normalizedHeader = header.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
        
        let value = '';
        
        // Match the header carefully by checking which words it contains
        if (normalizedHeader.includes('name')) {
          value = e.parameter.name || e.parameter.Name;
        } 
        else if (normalizedHeader.includes('whatsapp') || normalizedHeader.includes('whatsup')) {
          let num = e.parameter.whatsapp_number || e.parameter['WhatsApp Number'] || e.parameter.phone || '';
          if (num && !num.toString().startsWith('+91')) {
            value = '+91 ' + num;
          } else {
            value = num;
          }
        }
        else if (normalizedHeader.includes('phone') || normalizedHeader.includes('mobile')) {
          let num = e.parameter.phone || e.parameter.Phone || e.parameter.whatsapp_number || '';
          if (num && !num.toString().startsWith('+91')) {
            value = '+91 ' + num;
          } else {
            value = num;
          }
        }
        else if (normalizedHeader.includes('city')) {
          value = e.parameter.city || e.parameter.City;
        }
        else if (normalizedHeader.includes('usertype') || normalizedHeader.includes('who')) {
          value = e.parameter.userType || e.parameter['User Type'];
        }
        else if (normalizedHeader.includes('source') || normalizedHeader.includes('from')) {
          value = e.parameter.source || e.parameter.Source;
        }
        
        return value || '';
      }
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

## Step 3: Run Setup & Deploy
1. Click the **Save** icon.
2. Select the `initialSetup` function from the dropdown menu at the top and click **Run**.
3. Accept the permissions prompts (Click "Review permissions" > choose your account > Advanced > Go to Untitled project).
4. Click the blue **Deploy** button > **New deployment**.
5. Select type: **Web app**.
6. Set "Execute as" to **Me**.
7. Set "Who has access" to **Anyone**.
8. Click **Deploy**.
9. **Copy the "Web app URL" provided.**

## Step 4: Add the URL to your Landing Page Script
1. Open the file `js/script.js` in your project folder.
2. Replace the simulated form submission code (Lines 29-41) with the actual fetch code and your script URL:

```javascript
// Example JS Fetch (Add your WEB_APP_URL)
const scriptURL = 'YOUR_COPIED_WEB_APP_URL_HERE';

fetch(scriptURL, { method: 'POST', body: formData})
    .then(response => {
        btnText.style.display = 'block';
        loader.style.display = 'none';
        submitBtn.disabled = false;
        
        enrollForm.style.display = 'none';
        formMessage.style.display = 'block';
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert("Something went wrong. Please try again.");
        btnText.style.display = 'block';
        loader.style.display = 'none';
        submitBtn.disabled = false;
    });
```
