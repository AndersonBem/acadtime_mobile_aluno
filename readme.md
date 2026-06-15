# AcadTime Mobile

AcadTime Mobile is the student-facing mobile application of the AcadTime project. It helps students track complementary activity hours, submit certificates, review submission progress, receive notifications, and manage their academic profile from a mobile device.

The application was built with Expo and React Native, and it consumes the AcadTime backend API hosted at `https://acad-time.onrender.com`.

<details>
<summary>Ver README em Portugues (PT-BR)</summary>

# AcadTime Mobile

AcadTime Mobile e o aplicativo mobile do projeto AcadTime voltado para alunos. Ele permite que o aluno acompanhe suas horas de atividades complementares, envie certificados, revise o andamento das submissoes, receba notificacoes e gerencie seu perfil academico pelo celular.

O aplicativo foi desenvolvido com Expo e React Native, consumindo a API backend do AcadTime hospedada em `https://acad-time.onrender.com`.

## Principais Recursos

- Login exclusivo para usuarios do tipo aluno.
- Restauracao de sessao com armazenamento seguro do token.
- Dashboard com resumo academico e progresso de horas.
- Troca de curso ativo quando o aluno possui mais de uma matricula.
- Listagem e detalhamento de submissoes.
- Envio de certificados em PDF ou imagem.
- Captura de foto do certificado pela camera.
- Extracao de dados por OCR.
- Opcao de preenchimento manual quando a extracao automatica nao for usada.
- Notificacoes com controle de leitura.
- Perfil do aluno com atualizacao de foto.

## Tecnologias

- Expo SDK 54
- React 19
- React Native 0.81
- React Navigation
- Expo Secure Store
- Expo Document Picker
- Expo Image Picker
- Expo Local Authentication
- Expo Vector Icons

## Como Rodar

Clone o repositorio, entre na pasta do app mobile e instale as dependencias:

```bash
cd mobile_aluno/acadtime-mobile
npm install
```

Inicie o servidor de desenvolvimento do Expo:

```bash
npx expo start
```

Se houver problema de cache, rode:

```bash
npx expo start -c
```

Tambem e possivel usar os scripts do projeto:

```bash
npm run android
npm run ios
npm run web
```

</details>

## Features

- Student-only authentication.
- Session restoration with secure token storage.
- Dashboard with academic summary and hour progress.
- Active course selection for students enrolled in more than one course.
- Submission list and submission detail pages.
- Certificate upload using PDF or image files.
- Certificate photo capture with the device camera.
- OCR data extraction for certificate information.
- Manual submission flow when automatic extraction is not used.
- Notifications with read/unread control.
- Student profile with profile picture update.

## Technologies

- Expo SDK 54
- React 19
- React Native 0.81
- React Navigation
- Expo Secure Store
- Expo Document Picker
- Expo Image Picker
- Expo Local Authentication
- Expo Vector Icons

## Requirements

Before running the project, make sure you have:

- Node.js installed.
- npm installed.
- Expo Go installed on a mobile device, or an Android/iOS emulator configured.
- Internet access to communicate with the deployed AcadTime API.

## Installation

Clone the repository and open the mobile project folder:

```bash
cd mobile_aluno/acadtime-mobile
```

Install the dependencies:

```bash
npm install
```

## Running the App

Start the Expo development server:

```bash
npx expo start
```

If Expo shows cache-related errors, start it with a clean cache:

```bash
npx expo start -c
```

You can also use the available npm scripts:

```bash
npm run android
npm run ios
npm run web
```

## Project Structure

```text
acadtime-mobile/
  assets/              App icons, splash images, and static assets
  src/
    api/               Backend API clients and token storage
    components/        Reusable interface components
    contexts/          Global React contexts
    navigation/        Application route configuration
    pages/             Main application screens
    styles/            Global colors, spacing, and style tokens
  App.js               Application entry component
  app.json             Expo configuration
  index.js             Expo entry point
  package.json         Dependencies and scripts
```

## Main Screens

- `Login`: authenticates the student and blocks non-student users.
- `RecuperarSenha`: starts the password recovery flow.
- `Dashboard`: shows student information, active course, hour progress, and activity type progress.
- `Submissions`: lists the student's certificate submissions.
- `NewSubmission`: lets the student upload or photograph a certificate.
- `ReviewSubmission`: reviews OCR data or allows manual completion.
- `ConfirmSubmission`: confirms the submission data before sending it.
- `SuccessSubmission`: shows the final success feedback after submission.
- `SubmissionDetails`: displays detailed information about a specific submission.
- `Notifications`: lists notifications and allows them to be marked as read.
- `Profile`: shows profile data, updates the profile picture, and handles logout.

## API Integration

The API client is centralized in `src/api/client.js`. It defines the base URL, adds the JSON headers, attaches the JWT access token when available, and handles response parsing.

Important backend endpoints used by the mobile app include:

- `POST /login/`
- `POST /recuperar-senha/`
- `GET /aluno/`
- `GET /inscricao/`
- `GET /curso/`
- `GET /tipoAtividade/`
- `POST /atividadeComplementar/`
- `GET /mobile/dashboard/`
- `GET /mobile/dashboard/?curso=ID`
- `GET /mobile/perfil/`
- `PATCH /mobile/perfil/foto/`
- `GET /mobile/notificacoes/`
- `PATCH /mobile/notificacoes/{id}/marcar-lida/`
- `POST /mobile/notificacoes/marcar-todas-lidas/`
- `GET /submissao/`
- `GET /submissao/{id}/`
- `POST /submissao/`
- `GET /submissao/resumo-dashboard/`
- `GET /submissao/{id}/baixar-certificado/`
- `POST /ocr/`

## Authentication and Session

Authentication is handled in `src/api/auth.js`. After a successful login, the app checks whether the authenticated user is a student. If the user type is not `aluno`, access to the mobile app is blocked.

The session token and user data are saved with Expo Secure Store through `src/api/tokenStorage.js`. When the app starts, it attempts to restore the previous session and validates it with the backend.

## Course Context

The selected course is shared across authenticated screens through `src/contexts/CursoContext.js`.

This allows the Dashboard and other pages to read the same active course after the student changes it.

## Submission Flow

The certificate submission flow supports two paths:

1. Automatic extraction: the student uploads or photographs a certificate, and the app sends it to the OCR endpoint.
2. Manual completion: the student uploads or photographs a certificate and fills in the activity data manually.

Both flows send the certificate file and activity information to the backend through `POST /submissao/`.

## Development Notes

- Use `npx expo install` whenever installing Expo-related native packages.
- Keep the mobile API flow separate from the web frontend when a mobile-specific endpoint already exists.
- Do not commit temporary automatic login credentials.
- The app is designed for student users only.

## Academic Context

This README was prepared as the official English documentation for the AcadTime Mobile student application, as part of the Integrated Project documentation translation activity.
