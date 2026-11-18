// All data here is made up. No real residents, policies or enquiries.
window.PROTOTYPE_DATA = {
  label: "Synthetic data (made up)",
  enquiry: {
    caseId: "SYN-0001",
    channel: "Web form",
    received: "Mon 09:12 (made up)",
    subject: "Refund of my hall booking deposit",
    body:
      "Hi, I cancelled my booking of the Sunrise Community Hall last week. " +
      "When will I get my deposit back, and do I need to send anything? (made up)"
  },
  policyPages: [
    {
      id: "P-101",
      title: "Hall booking deposit refunds (made up)",
      owner: "Facilities team (made up)",
      updated: "Updated 02 Nov (made up)",
      passages: [
        { id: "P-101-a", text: "A deposit is refunded in full when a booking is cancelled at least 7 days before the event date." },
        { id: "P-101-b", text: "Refunds are paid to the original payment method within 10 working days of approval." },
        { id: "P-101-c", text: "No form is needed. The refund starts automatically once the cancellation is recorded." }
      ]
    }
  ],
  draft: [
    { id: "L1", text: "Thank you for contacting us about your cancelled booking.", cite: null },
    { id: "L2", text: "Your deposit is refunded in full if you cancelled at least 7 days before the event date.", cite: "P-101-a" },
    { id: "L3", text: "The refund goes back to your original payment method within 10 working days of approval.", cite: "P-101-b" },
    { id: "L4", text: "You do not need to send anything. The refund starts once your cancellation is recorded.", cite: "P-101-c" }
  ]
};
