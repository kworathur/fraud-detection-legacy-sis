
[![E2E Tests](https://github.com/kworathur/experience-idol/actions/workflows/playwright.yml/badge.svg)](https://github.com/kworathur/experience-idol/actions/workflows/playwright.yml)

# Financial Aid Fraud Detection Inside Ellucian Experience

Higher education institutions struggle to ensure that financial aid money goes in the right hands. The U.S. Department of Education found [**over 40$ million in loans**](https://www.ed.gov/about/news/press-release/us-department-of-education-fights-fraud-student-aid-protect-american-taxpayer) issued to ineligible recipients in 2025 alone. Community colleges are the hardest hit by financial aid fraud, with institutions in California disbursing [**over 7.6$ million dollars to fraudulent identities**](https://er.educause.edu/articles/sponsored/2025/2/fighting-financial-aid-fraud-in-higher-education) in the first three quarters of 2024.

Campuses across the country rely on Student Information Systems (SIS) (e.g. Ellucian Banner) to track enrollment, coordinate aid payouts, among many other functions. Once in the system, a "student" can apply for financial aid, receive student discounts, and apply for loans without ever intending to attend classes. Quaid ("Qualified Aid") is a direct solution to this glaring issue in legacy systems, allowing for institutions to keep using their systems while tapping into the robust ID verification features of this project. Notably, this tool can integrate with learning management systems (LMSes) to perform behavioral analytics on an instutition's students to increase fraud detection coverage.


## Market Analysis

- Plaid is a major competitor to this product, but does not integrate behavioral data into their verification workflow. This shortcoming is crucial as some cases of enrolment fraud play out over multiple semesters as students skip classes and use AI bots to attend their classes, while receiving aid payouts.

## Documentation

- [Fraud detection API documentation](https://www.docs.quaid-ai.com)

## Feature Demos

As a student, I should be able to book meetings with my advisor to validate my identity and explain attendance behavior that was flagged by the AI tool
<img width="1144" height="720" alt="book_advising_meeting" src="https://github.com/user-attachments/assets/799c297f-067d-4df9-b972-b2e4ebbee3c0" />

## Changelog

v0.1.0 - Implented background checks API routes and dashboard landing page with personalized advising card
