README PROVISORIO - ACADTIME MOBILE ALUNO
=========================================

Este app mobile e focado no aluno.
A parte web fica na pasta frontend e nao deve ser alterada por este fluxo.


COMO RODAR
----------

Na pasta mobile_aluno/acadtime-mobile:

npm install
npx expo start

Se houver erro de cache:

npx expo start -c


DEPENDENCIAS IMPORTANTES
------------------------

O app usa:

- Expo SDK 54
- React Native 0.81.5
- React Navigation
- expo-secure-store
- @expo/vector-icons

Dependencias de navegacao instaladas:

- @react-navigation/native
- @react-navigation/native-stack
- react-native-screens
- react-native-safe-area-context

Use npx expo install para pacotes nativos do Expo quando possivel.


ESTRUTURA PRINCIPAL
-------------------

src/api/
  Chamadas para o backend.

src/components/
  Componentes reutilizaveis de UI.

src/contexts/
  Contextos globais, como o curso selecionado.

src/navigation/
  Configuracao de rotas do app.

src/pages/
  Telas do app.

src/styles/
  Cores, espacamentos e tokens globais.


API MOBILE
----------

Arquivos principais:

- src/api/client.js
  Centraliza fetch, base URL e token JWT.

- src/api/tokenStorage.js
  Salva/restaura sessao com expo-secure-store.

- src/api/auth.js
  Login, logout, restauracao de sessao e recuperacao de senha.

- src/api/dashboard.js
  Dados do Dashboard.

- src/api/perfil.js
  Perfil e foto do aluno.

- src/api/notificacoes.js
  Notificacoes e marcar como lida.

- src/api/submissoes.js
  Lista, detalhe e criacao de submissoes.


NAVEGACAO
---------

A navegacao esta em:

src/navigation/Routes.js

Fluxo atual:

- Se existe sessao valida: mostra telas logadas.
- Se nao existe sessao: mostra Login.

Rotas logadas atuais:

- Dashboard
- Submissions
- NewSubmission
- Notifications
- Profile

O BottomTabBar usa estes nomes de rota.
Se criar uma nova tela principal, registre em Routes.js e atualize o menu se necessario.


CURSO SELECIONADO
-----------------

O curso selecionado e global.
Ele fica em:

src/contexts/CursoContext.js

Use em uma tela assim:

import { useCurso } from '../contexts/CursoContext';

const { cursoSelecionado, setCursoSelecionado } = useCurso();

Quando o aluno troca o curso no Dashboard, outras telas podem ler o mesmo curso.


DASHBOARD
---------

A tela Dashboard ja consome dados reais do backend.

Ela usa:

- GET /mobile/dashboard/
- GET /mobile/dashboard/?curso=ID

Mostra:

- nome do aluno
- foto no header
- curso atual com troca de curso
- resumo geral
- progresso de horas
- progresso por tipo de atividade


BACKEND
-------

Endpoints mobile importantes:

- POST /login/
- GET /mobile/dashboard/
- GET /mobile/perfil/
- PATCH /mobile/perfil/foto/
- GET /mobile/notificacoes/
- PATCH /mobile/notificacoes/{id}/marcar-lida/
- POST /mobile/notificacoes/marcar-todas-lidas/
- GET /submissao/
- GET /submissao/{id}/
- POST /submissao/
- POST /ocr/


OBSERVACOES
-----------

- O Login visual final pode ser substituido por outro dev.
- O app bloqueia usuarios que nao sejam aluno no auth.js.
- O endpoint POST /login-aluno/ ficou como melhoria futura.
- Evite alterar endpoints usados pela web se um endpoint mobile proprio resolver.
- Antes de commit, remova qualquer auto login temporario com email/senha no App.js.
