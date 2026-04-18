
[![E2E Tests](https://github.com/kworathur/experience-idol/actions/workflows/playwright.yml/badge.svg)](https://github.com/kworathur/experience-idol/actions/workflows/playwright.yml)

# Financial Aid Fraud Detection Inside Ellucian Experience

Verifying that financial aid money is disbursed to eligible students is becoming a challenge for higher education institutions, especially community colleges. The U.S. Department of Education found [**over 40$ million in loans**](https://www.ed.gov/about/news/press-release/us-department-of-education-fights-fraud-student-aid-protect-american-taxpayer) issued to ineligible recipients in the past year alone. 

As enrollment grows, the use of automated workflows for verifying students is the best way to scale an institution's enrollment drive.

This is why I built a tool that integrates natively with student information systems (SIS), like Ellucian's experience platform, which contain student demographic data and FAFSA responses. None of the existing solutions for financial aid verification leverage **behavioral data** such as attendance data from third party platforms, which is what this tool enables.

## Documentation

- [Fraud detection API documentation](https://www.docs.quaid-ai.com)

## Feature Demos

As a student, I should be able to book meetings with my advisor to validate my identity and explain attendance behavior that was flagged by the AI tool
<img width="1144" height="720" alt="book_advising_meeting" src="https://github.com/user-attachments/assets/799c297f-067d-4df9-b972-b2e4ebbee3c0" />

## Changelog

v0.1.0 - Implented background checks API routes and dashboard landing page with personalized advising card
