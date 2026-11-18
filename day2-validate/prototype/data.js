// All data here is made up. No real residents, policies or enquiries.
// Every line either cites a policy passage or says "needsSource: false" (a greeting or
// courtesy line with no facts in it). Any other line with no cite is an unsourced claim.
// "conf: low" marks an unsourced claim the AI itself flagged as unsure.
window.PROTOTYPE_DATA = {
  label: "Synthetic data (made up)",
  // Approved snippets (made up). Each one is tied to the policy passage that approves it.
  // Plain wording only: no buzzwords, no motherhood statements.
  snippets: [
    { id: "S-01", title: "Deposit refund: full refund rule", cite: "P-101-a", keywords: "refund deposit cancel cancelled",
      text: "Your deposit is refunded in full if you cancelled at least 7 days before the event date." },
    { id: "S-02", title: "Deposit refund: payment timing", cite: "P-101-b", keywords: "refund deposit payment when time days",
      text: "The refund goes back to your original payment method within 10 working days of approval." },
    { id: "S-03", title: "Deposit refund: no form needed", cite: "P-101-c", keywords: "refund form send document",
      text: "You do not need to send anything. The refund starts once your cancellation is recorded." },
    { id: "S-04", title: "Date change: when allowed", cite: "P-102-a", keywords: "date change move reschedule later",
      text: "You can change the date up to 7 days before the event, if the hall is free on the new date." },
    { id: "S-05", title: "Date change: how to request", cite: "P-102-b", keywords: "date change request account how",
      text: "Please make the request through your booking account." },
    { id: "S-06", title: "Organisation booking: how to book", cite: "P-103-a", keywords: "book booking organisation charity portal how",
      text: "Please book through the online booking portal using your organisation account." },
    { id: "S-07", title: "Hire rate: where to find it", cite: "P-103-b", keywords: "rate cost price fee hire charge",
      text: "The hire rate is shown on the booking page." }
  ],
  cases: [
    {
      tab: "1 · Clean match",
      enquiry: {
        caseId: "SYN-0001",
        channel: "Web form",
        received: "Mon 09:12 (made up)",
        subject: "Refund of my hall booking deposit",
        body: "Hi, I cancelled my booking of the Sunrise Community Hall last week. When will I get my deposit back, and do I need to send anything? (made up)"
      },
      policy: {
        id: "P-101",
        title: "Hall booking deposit refunds (made up)",
        owner: "Facilities team (made up)",
        updated: "Updated 02 Nov (made up)",
        passages: [
          { id: "P-101-a", text: "A deposit is refunded in full when a booking is cancelled at least 7 days before the event date." },
          { id: "P-101-b", text: "Refunds are paid to the original payment method within 10 working days of approval." },
          { id: "P-101-c", text: "No form is needed. The refund starts automatically once the cancellation is recorded." }
        ]
      },
      draft: [
        { id: "L1", text: "Thank you for contacting us about your cancelled booking.", cite: null, needsSource: false },
        { id: "L2", text: "Your deposit is refunded in full if you cancelled at least 7 days before the event date.", cite: "P-101-a" },
        { id: "L3", text: "The refund goes back to your original payment method within 10 working days of approval.", cite: "P-101-b" },
        { id: "L4", text: "You do not need to send anything. The refund starts once your cancellation is recorded.", cite: "P-101-c" }
      ]
    },
    {
      tab: "2 · Low-confidence line",
      enquiry: {
        caseId: "SYN-0002",
        channel: "Email",
        received: "Mon 10:40 (made up)",
        subject: "Changing the date of my hall booking",
        body: "Hello, can I move my Sunrise Community Hall booking to a later date, and will I be charged for the change? (made up)"
      },
      policy: {
        id: "P-102",
        title: "Hall booking date changes (made up)",
        owner: "Facilities team (made up)",
        updated: "Updated 14 Oct (made up)",
        passages: [
          { id: "P-102-a", text: "A booking date can be changed up to 7 days before the event date, subject to the hall being free on the new date." },
          { id: "P-102-b", text: "Date change requests are made through the booking account." }
        ]
      },
      draft: [
        { id: "L1", text: "Thank you for asking about changing your booking date.", cite: null, needsSource: false },
        { id: "L2", text: "You can change the date up to 7 days before the event, if the hall is free on the new date.", cite: "P-102-a" },
        { id: "L3", text: "Please make the request through your booking account.", cite: "P-102-b" },
        { id: "L4", text: "A change fee of $20 may apply.", cite: null, conf: "low", why: "No policy passage states a fee. Check before sending." }
      ]
    },
    {
      tab: "3 \u00b7 Event booking",
      // Hidden test (made up): L3 is an unsourced claim. The code finds it with the same rule
      // as every other line, but does not show the flag here. Does the officer catch it?
      hiddenTest: true,
      enquiry: {
        caseId: "SYN-0003",
        channel: "Web form",
        received: "Tue 14:05 (made up)",
        subject: "Booking the hall for a charity event",
        body: "Hi, we are a charity planning a fundraising dinner at the Sunrise Community Hall. How do we book it, and what does it cost? (made up)"
      },
      policy: {
        id: "P-103",
        title: "Hall bookings for organisations (made up)",
        owner: "Facilities team (made up)",
        updated: "Updated 28 Oct (made up)",
        passages: [
          { id: "P-103-a", text: "Organisations book the hall through the online booking portal with their organisation account." },
          { id: "P-103-b", text: "The standard hire rate applies to all bookings and is shown on the booking page." }
        ]
      },
      draft: [
        { id: "L1", text: "Thank you for your interest in holding your fundraising dinner at the hall.", cite: null, needsSource: false },
        { id: "L2", text: "Please book through the online booking portal using your organisation account.", cite: "P-103-a" },
        { id: "L3", text: "As a registered charity, you are entitled to a 50% discount on the hire rate.", cite: null },
        { id: "L4", text: "The hire rate is shown on the booking page.", cite: "P-103-b" }
      ]
    },
    {
      tab: "4 \u00b7 Lookup fails",
      // Forced failure (made up): the policy lookup always fails for this case.
      lookup: "fail",
      gapTopic: "Noise rules and end times for live music at the hall",
      gapOwner: "Facilities team (made up)",
      enquiry: {
        caseId: "SYN-0004",
        channel: "Web form",
        received: "Wed 11:20 (made up)",
        subject: "Live band at my hall booking",
        body: "Hi, we want a live band at our event at the Sunrise Community Hall. Are there noise rules or an end time we must follow? (made up)"
      },
      policy: null,
      draft: [
        { id: "L1", text: "Thank you for asking about music at your hall booking.", cite: null, needsSource: false }
      ]
    }
  ]
};
