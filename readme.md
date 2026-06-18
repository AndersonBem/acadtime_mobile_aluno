# AcadTime Mobile

## Overview

AcadTime Mobile is a mobile application developed for students to manage their complementary academic activities. The main goal of the application is to simplify the process of submitting certificates and tracking the progress of academic requirements directly from a mobile device.

The application was built using React Native and Expo and communicates with the AcadTime backend API to manage authentication, student data, submissions, notifications, and academic progress.

## Main Features

The application provides several features for students:

- Secure student authentication
- Dashboard with academic progress information
- Course selection for students enrolled in multiple courses
- Certificate submission using PDF files or images
- Camera integration to capture certificate photos
- OCR extraction to automatically identify certificate information
- Manual form completion when OCR is not used
- Submission history and detailed submission tracking
- Notification management
- Student profile management

## Technologies

The project was developed using:

- React Native
- Expo
- React Navigation
- Expo Secure Store
- Expo Document Picker
- Expo Image Picker

These technologies provide a modern mobile experience while allowing integration with backend services.

## Submission Process

One of the most important features of the application is the certificate submission workflow.

The process consists of four steps:

1. The student uploads a certificate or takes a photo using the device camera.
2. The application can automatically extract information from the certificate using OCR technology.
3. The student reviews the extracted information and can edit any field if necessary.
4. The submission is confirmed and sent to the backend for evaluation.

If the OCR extraction is not available or does not identify all information correctly, the student can complete the form manually.

## Project Structure

```text
src/
 ├── api/
 ├── components/
 ├── contexts/
 ├── navigation/
 ├── pages/
 └── styles/
```

This organization helps keep the code maintainable and easy to understand.

## Running the Project

Install the dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

You can also run the application on Android, iOS, or Web using the available Expo commands.

## Conclusion

AcadTime Mobile improves the experience of students by making the submission and management of complementary activities faster and more accessible. Through mobile technologies and OCR integration, the application reduces manual work and simplifies the academic validation process.
