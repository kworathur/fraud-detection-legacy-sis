
[![E2E Tests](https://github.com/kworathur/experience-idol/actions/workflows/playwright.yml/badge.svg)](https://github.com/kworathur/experience-idol/actions/workflows/playwright.yml)

# Financial Aid Fraud Detection Inside Ellucian Experience

![Experience Dashboard - Student View](https://github.com/user-attachments/assets/f5490c62-a2b0-4e6c-9b75-5d211ef70070)

## Introduction

The U.S. department of education has been using ![data models](https://www.ed.gov/about/news/press-release/us-department-of-education-fights-fraud-student-aid-protect-american-taxpayer) to find fraud in FAFSA applications, finding over 40$ million indirect loans issued to ineligible recipients. First time applicants that are suspected of fraud are placed in V4/V5 verification, where they must provide government-issued identification to confirm their identity.

Yet, a considerable amount of fraud can only be detected by observing a student's behavior over time. This project uses attendance data and FAFSA application fields to identify potential fraudsters in higher education institutions.

## Problem Statement

Many students complete their degrees without engaging in one-on-one advising sessions. This leads to students potentially missing out on value-added credentials, early career opportunities, and more. One solution to this problem is to suggest to students topics they can discuss with their advisor using a card in their student dashboard.

## UI/UX Design

I designed the card so that it is not information dense and interactive. The use of a chat bubble helps catch the student's attention and gives the card a more personal feel.


![not_booked](https://github.com/user-attachments/assets/c7d76e24-d32d-4bcc-a225-4115d535a766)

## Tech Stack

UI/UX Design - Figma
Frontend - NextJS app hosted on AWS Amplify
Backend - Serverless REST API written with typescript, also hosted on AWS.

## Challenges

The major challenge I ran into was spending less time auditing code produced by LLMs closer to the project deadline, which resulted in the codebase growing at a rate faster than I could understand the new code being written.

## Future Plans

I plan to use this student dashboard as an ideation space for startup ideas. I also plan to integrate the system with legacy systems (e.g. SAML with Azure AD) to showcase to future customers the ease of integration.

## TODO
- Define software versions
- Deploy public-facing documentation
